/**
 * Spotify integration with secure credential handling.
 *
 * Security model:
 * - spotifyCredentials table (tokens) is ONLY accessed by internal functions
 * - The sole public function (currentlyPlaying) reads from spotifyNowPlaying (metadata only)
 * - All Spotify API calls happen server-side via cron, never from the client
 * - Client secrets live in Convex environment variables, never in client bundles
 */
import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

// ============ Spotify API Types ============

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface SpotifyTrack {
  id?: string | null;
  name: string;
  artists: { name: string; external_urls: { spotify: string } }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
    external_urls: { spotify: string };
  };
  duration_ms: number;
  external_urls: { spotify: string };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  item: SpotifyTrack | null;
}

interface NowPlayingSnapshot {
  isPlaying: boolean;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArt: string;
  trackUrl?: string | null;
  trackId?: string;
  progressMs: number;
  durationMs: number;
  fetchedAt: number;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

// ============ Public Query (client subscribes to this) ============

export const currentlyPlaying = query({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db.query("spotifyNowPlaying").first();
    if (!doc) return null;

    return {
      isPlaying: doc.isPlaying,
      trackName: doc.trackName,
      artistName: doc.artistName,
      albumName: doc.albumName,
      albumArt: doc.albumArt,
      trackUrl: doc.trackUrl ?? null,
      trackId: doc.trackId,
      progressMs: doc.progressMs,
      durationMs: doc.durationMs,
      fetchedAt: doc.fetchedAt,
    };
  },
});

// ============ Internal: Credential Management ============

export const getCredentials = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"spotifyCredentials"> | null> => {
    return await ctx.db.query("spotifyCredentials").first();
  },
});

export const updateTokens = internalMutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("spotifyCredentials").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("spotifyCredentials", args);
    }
  },
});

// ============ Internal: Now Playing Cache ============

export const updateNowPlaying = internalMutation({
  args: {
    isPlaying: v.boolean(),
    trackName: v.string(),
    artistName: v.string(),
    albumName: v.string(),
    albumArt: v.string(),
    trackUrl: v.optional(v.union(v.string(), v.null())),
    trackId: v.optional(v.string()),
    progressMs: v.number(),
    durationMs: v.number(),
    fetchedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("spotifyNowPlaying").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("spotifyNowPlaying", args);
    }
  },
});

export const clearNowPlaying = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("spotifyNowPlaying").first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getNowPlayingSnapshot = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("spotifyNowPlaying").first();
  },
});

// ============ Token Refresh ============

async function refreshAccessToken(
  refreshTokenValue: string,
): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing Spotify credentials in environment");
    return null;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshTokenValue,
    }),
  });

  if (!response.ok) {
    console.error("Token refresh failed:", response.status);
    return null;
  }

  const data: SpotifyTokenResponse = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshTokenValue,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

function normalizeNowPlaying(data: SpotifyCurrentlyPlaying): NowPlayingSnapshot | null {
  if (!data.item || data.currently_playing_type !== "track") {
    return null;
  }

  const track = data.item;
  const durationMs = Math.max(0, track.duration_ms ?? 0);
  const progressRaw = data.progress_ms ?? 0;
  const progressMs = Math.min(Math.max(0, progressRaw), durationMs);
  const trackUrl = track.external_urls?.spotify ?? track.album.external_urls?.spotify ?? null;

  return {
    isPlaying: data.is_playing,
    trackName: track.name,
    artistName: track.artists.map((a) => a.name).join(", "),
    albumName: track.album.name,
    albumArt: track.album.images[0]?.url ?? "",
    trackUrl,
    trackId: toOptionalString(track.id),
    progressMs,
    durationMs,
    fetchedAt: Date.now(),
  };
}

// ============ Cron: Poll Spotify API ============

export const pollNowPlaying = internalAction({
  args: {},
  handler: async (ctx) => {
    const markCurrentTrackAsNotPlaying = async () => {
      const existing = await ctx.runQuery(internal.spotify.getNowPlayingSnapshot);
      if (!existing || !existing.isPlaying) {
        return;
      }

      await ctx.runMutation(internal.spotify.updateNowPlaying, {
        isPlaying: false,
        trackName: existing.trackName,
        artistName: existing.artistName,
        albumName: existing.albumName,
        albumArt: existing.albumArt,
        trackUrl: existing.trackUrl ?? null,
        trackId: toOptionalString(existing.trackId),
        progressMs: Math.min(existing.progressMs, existing.durationMs),
        durationMs: existing.durationMs,
        fetchedAt: Date.now(),
      });
    };

    let credentials = await ctx.runQuery(internal.spotify.getCredentials);
    if (!credentials) return;

    // Refresh token if expiring within 5 minutes
    const REFRESH_BUFFER_MS = 5 * 60 * 1000;
    if (credentials.expiresAt < Date.now() + REFRESH_BUFFER_MS) {
      const newTokens = await refreshAccessToken(credentials.refreshToken);
      if (!newTokens) return;
      await ctx.runMutation(internal.spotify.updateTokens, newTokens);
      credentials = { ...credentials, ...newTokens };
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${credentials.accessToken}` } },
    );

    // 204 = nothing playing
    if (response.status === 204) {
      await markCurrentTrackAsNotPlaying();
      return;
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error("Spotify API authorization error:", response.status);
      } else if (response.status === 429) {
        console.error("Spotify API rate limit reached");
      } else if (response.status >= 500) {
        console.error("Spotify API server error:", response.status);
      } else {
        console.error("Spotify API error:", response.status);
      }
      return;
    }

    const data = (await response.json()) as SpotifyCurrentlyPlaying;
    const normalized = normalizeNowPlaying(data);

    if (!normalized) {
      await markCurrentTrackAsNotPlaying();
      return;
    }

    await ctx.runMutation(internal.spotify.updateNowPlaying, normalized);
  },
});
