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
const THROTTLE_MS = 5_000;

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

function getDocTimestamp(
  doc: { _creationTime: number; fetchedAt?: number },
): number {
  return typeof doc.fetchedAt === "number" ? doc.fetchedAt : doc._creationTime;
}

function getLatestDoc<T extends { _id: unknown; _creationTime: number; fetchedAt?: number }>(
  docs: T[],
): T | null {
  let latest: T | null = null;
  for (const doc of docs) {
    if (!latest || getDocTimestamp(doc) > getDocTimestamp(latest)) {
      latest = doc;
    }
  }
  return latest;
}

function getDuplicateDocs<
  T extends { _id: unknown; _creationTime: number; fetchedAt?: number },
>(docs: T[]): T[] {
  const latest = getLatestDoc(docs);
  if (!latest) return [];
  return docs.filter((doc) => doc._id !== latest._id);
}

function toIdleSnapshot(): NowPlayingSnapshot {
  return {
    isPlaying: false,
    trackName: "",
    artistName: "",
    albumName: "",
    albumArt: "",
    trackUrl: null,
    trackId: undefined,
    progressMs: 0,
    durationMs: 0,
    fetchedAt: Date.now(),
  };
}

// ─── Public query (clients subscribe here) ───────────────────────────

export const currentlyPlaying = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("spotifyNowPlaying").collect();
    const doc = getLatestDoc(docs);
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
    const docs = await ctx.db.query("spotifyCredentials").collect();
    return getLatestDoc(docs);
  },
});

export const getNowPlaying = internalQuery({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("spotifyNowPlaying").collect();
    return getLatestDoc(docs);
  },
});

export const updateTokens = internalMutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("spotifyCredentials").collect();
    const existing = getLatestDoc(docs);
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("spotifyCredentials", args);
    }

    for (const duplicate of getDuplicateDocs(docs)) {
      await ctx.db.delete(duplicate._id);
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
    const docs = await ctx.db.query("spotifyNowPlaying").collect();
    const existing = getLatestDoc(docs);
    const duplicates = getDuplicateDocs(docs);
    if (!existing) {
      await ctx.db.insert("spotifyNowPlaying", args);
      return;
    }

    // Reject stale writes — a slower concurrent refresh must not overwrite
    // a newer one (prevents the "wrong song" race condition).
    if (args.fetchedAt < existing.fetchedAt) {
      for (const duplicate of duplicates) {
        await ctx.db.delete(duplicate._id);
      }
      return;
    }

    const meaningfulChange =
      existing.trackId !== args.trackId ||
      existing.isPlaying !== args.isPlaying ||
      existing.trackName !== args.trackName ||
      existing.artistName !== args.artistName ||
      existing.albumName !== args.albumName ||
      existing.durationMs !== args.durationMs;

    if (args.isPlaying || meaningfulChange) {
      await ctx.db.patch(existing._id, args);
    } else {
      // Idle with no meaningful change — only bump fetchedAt so the
      // server-side throttle stays accurate (avoids wasteful API calls).
      await ctx.db.patch(existing._id, { fetchedAt: args.fetchedAt });
    }

    for (const duplicate of duplicates) {
      await ctx.db.delete(duplicate._id);
    }
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
      await ctx.runMutation(internal.spotify.updateNowPlaying, toIdleSnapshot());
      return;
    }

    if (!response.ok) {
      console.error("Spotify API error:", response.status);
      return;
    }

    const data = (await response.json()) as SpotifyCurrentlyPlaying;
    const normalized = normalizeNowPlaying(data);

    if (!normalized) {
      await ctx.runMutation(internal.spotify.updateNowPlaying, toIdleSnapshot());
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
