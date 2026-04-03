/**
 * Spotify integration — simple SWR caching layer.
 *
 * Architecture:
 *  - spotifyNowPlaying holds the last-known playback state.
 *  - Clients subscribe via `currentlyPlaying` (reactive query).
 *  - Clients call `ensureFreshNowPlaying` every ~10s; the action
 *    short-circuits if the cache is younger than THROTTLE_MS.
 *  - A cron calls `refreshNowPlaying` every few minutes as a safety net.
 *  - Credentials stay internal — no tokens ever reach the client.
 */
import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const THROTTLE_MS = 10_000;

// ─── Spotify API types ───────────────────────────────────────────────

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

function toIdleSnapshot(existing: Doc<"spotifyNowPlaying">): NowPlayingSnapshot {
  return {
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
  };
}

// ─── Public query (clients subscribe here) ───────────────────────────

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

// ─── Internal helpers ────────────────────────────────────────────────

export const getCredentials = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"spotifyCredentials"> | null> => {
    return await ctx.db.query("spotifyCredentials").first();
  },
});

export const getNowPlaying = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("spotifyNowPlaying").first();
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
    if (!existing) {
      await ctx.db.insert("spotifyNowPlaying", args);
      return;
    }

    const meaningfulChange =
      existing.trackId !== args.trackId ||
      existing.isPlaying !== args.isPlaying ||
      existing.trackName !== args.trackName ||
      existing.artistName !== args.artistName ||
      existing.albumName !== args.albumName ||
      existing.durationMs !== args.durationMs;

    // Always write when playing (keeps progress in sync for subscribers).
    // When idle, only write on meaningful changes to avoid needless pushes.
    if (!args.isPlaying && !meaningfulChange) return;

    await ctx.db.patch(existing._id, args);
  },
});

// ─── Token refresh ───────────────────────────────────────────────────

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
  if (!data.item || data.currently_playing_type !== "track") return null;

  const track = data.item;
  const durationMs = Math.max(0, track.duration_ms ?? 0);
  const progressRaw = data.progress_ms ?? 0;
  const progressMs = Math.min(Math.max(0, progressRaw), durationMs);
  const trackUrl =
    track.external_urls?.spotify ?? track.album.external_urls?.spotify ?? null;

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

// ─── Core refresh (internal action — called by cron & public action) ─

export const refreshNowPlaying = internalAction({
  args: {},
  handler: async (ctx) => {
    let credentials = await ctx.runQuery(internal.spotify.getCredentials);
    if (!credentials) return;

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

    if (response.status === 204) {
      const existing = await ctx.runQuery(internal.spotify.getNowPlaying);
      if (existing?.isPlaying) {
        await ctx.runMutation(
          internal.spotify.updateNowPlaying,
          toIdleSnapshot(existing),
        );
      }
      return;
    }

    if (!response.ok) {
      console.error("Spotify API error:", response.status);
      return;
    }

    const data = (await response.json()) as SpotifyCurrentlyPlaying;
    const normalized = normalizeNowPlaying(data);

    if (!normalized) {
      const existing = await ctx.runQuery(internal.spotify.getNowPlaying);
      if (existing?.isPlaying) {
        await ctx.runMutation(
          internal.spotify.updateNowPlaying,
          toIdleSnapshot(existing),
        );
      }
      return;
    }

    await ctx.runMutation(internal.spotify.updateNowPlaying, normalized);
  },
});

// ─── Public action (frontend calls this every ~10s) ──────────────────

export const ensureFreshNowPlaying = action({
  args: {},
  handler: async (ctx) => {
    const current = await ctx.runQuery(internal.spotify.getNowPlaying);
    if (current && Date.now() - current.fetchedAt < THROTTLE_MS) {
      return { refreshed: false };
    }
    await ctx.runAction(internal.spotify.refreshNowPlaying);
    return { refreshed: true };
  },
});
