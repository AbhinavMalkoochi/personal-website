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
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const LOCK_TTL_MS = 10_000;
const PLAYING_STALE_MS = 15_000;
const IDLE_STALE_MS = 120_000;
const PROGRESS_CORRECTION_MS = 90_000;
const SERVER_ERROR_BACKOFF_MS = 30_000;
const RATE_LIMIT_BACKOFF_MS = 60_000;

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

function parseRetryAfterMs(retryAfter: string | null): number | null {
  if (!retryAfter) return null;

  const asSeconds = Number(retryAfter);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) {
    return Math.round(asSeconds * 1000);
  }

  const parsedDate = Date.parse(retryAfter);
  if (!Number.isNaN(parsedDate)) {
    return Math.max(0, parsedDate - Date.now());
  }

  return null;
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

export const getPollState = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"spotifyPollState"> | null> => {
    return await ctx.db.query("spotifyPollState").first();
  },
});

export const tryAcquirePollLock = internalMutation({
  args: {
    now: v.number(),
    lockTtlMs: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("spotifyPollState").first();

    if (existing && existing.lockUntil > args.now) {
      return false;
    }

    const payload = {
      lockUntil: args.now + args.lockTtlMs,
      nextAllowedPollAt: existing?.nextAllowedPollAt ?? 0,
      lastAttemptAt: args.now,
      lastSuccessAt: existing?.lastSuccessAt ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("spotifyPollState", payload);
    }

    return true;
  },
});

export const releasePollLock = internalMutation({
  args: {
    now: v.number(),
    success: v.boolean(),
    backoffMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("spotifyPollState").first();
    const nextAllowedPollAt = args.success
      ? 0
      : Math.max(existing?.nextAllowedPollAt ?? 0, args.now + (args.backoffMs ?? 0));

    const payload = {
      lockUntil: 0,
      nextAllowedPollAt,
      lastAttemptAt: args.now,
      lastSuccessAt: args.success ? args.now : existing?.lastSuccessAt ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("spotifyPollState", payload);
    }
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
    if (!existing) {
      await ctx.db.insert("spotifyNowPlaying", args);
      return;
    }

    const metadataChanged =
      existing.trackName !== args.trackName ||
      existing.artistName !== args.artistName ||
      existing.albumName !== args.albumName ||
      existing.albumArt !== args.albumArt ||
      (existing.trackUrl ?? null) !== (args.trackUrl ?? null) ||
      (existing.trackId ?? null) !== (args.trackId ?? null) ||
      existing.durationMs !== args.durationMs;

    const playbackStateChanged = existing.isPlaying !== args.isPlaying;
    const progressDelta = Math.abs(existing.progressMs - args.progressMs);
    const correctionDue = args.isPlaying && args.fetchedAt - existing.fetchedAt >= PROGRESS_CORRECTION_MS;
    const seekLikely = args.isPlaying && progressDelta >= 5000;

    if (!metadataChanged && !playbackStateChanged && !correctionDue && !seekLikely) {
      return;
    }

    await ctx.db.patch(existing._id, args);
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

export const ensureFreshNowPlaying = action({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const snapshot = await ctx.runQuery(internal.spotify.getNowPlayingSnapshot);

    if (snapshot) {
      const staleAfterMs = snapshot.isPlaying ? PLAYING_STALE_MS : IDLE_STALE_MS;
      if (now - snapshot.fetchedAt < staleAfterMs) {
        return { refreshed: false, reason: "fresh" as const };
      }
    }

    const pollState = await ctx.runQuery(internal.spotify.getPollState);
    if (pollState && pollState.nextAllowedPollAt > now) {
      return { refreshed: false, reason: "backoff" as const };
    }

    await ctx.runAction(internal.spotify.pollNowPlaying);
    return { refreshed: true, reason: "polled" as const };
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
    const startTime = Date.now();
    const pollState = await ctx.runQuery(internal.spotify.getPollState);
    if (pollState && pollState.nextAllowedPollAt > startTime) {
      return;
    }

    const lockAcquired = await ctx.runMutation(internal.spotify.tryAcquirePollLock, {
      now: startTime,
      lockTtlMs: LOCK_TTL_MS,
    });
    if (!lockAcquired) {
      return;
    }

    let success = false;
    let backoffMs = 0;

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

    try {
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

      // 204 = nothing playing
      if (response.status === 204) {
        await markCurrentTrackAsNotPlaying();
        success = true;
        return;
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Spotify API authorization error:", response.status);
        } else if (response.status === 429) {
          const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
          backoffMs = retryAfterMs ?? RATE_LIMIT_BACKOFF_MS;
          console.error("Spotify API rate limit reached");
        } else if (response.status >= 500) {
          backoffMs = SERVER_ERROR_BACKOFF_MS;
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
        success = true;
        return;
      }

      await ctx.runMutation(internal.spotify.updateNowPlaying, normalized);
      success = true;
    } finally {
      await ctx.runMutation(internal.spotify.releasePollLock, {
        now: Date.now(),
        success,
        backoffMs,
      });
    }
  },
});
