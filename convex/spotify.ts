import { v } from "convex/values";
import { query, mutation, action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// ============ Types ============

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  name: string;
  external_urls: { spotify: string };
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
  external_urls: { spotify: string };
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: { spotify: string };
  type: "track";
}

interface SpotifyCurrentlyPlayingResponse {
  is_playing: boolean;
  progress_ms: number;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  item: SpotifyTrack | null;
}

export interface NowPlayingData {
  isPlaying: boolean;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArt: string;
  trackUrl: string;
  progressMs: number;
  durationMs: number;
}

// ============ Internal Queries/Mutations ============

export const getCredentialsInternal = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"spotifyCredentials"> | null> => {
    return await ctx.db.query("spotifyCredentials").first();
  },
});

export const updateTokensInternal = internalMutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    const existing = await ctx.db.query("spotifyCredentials").first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
      });
    } else {
      await ctx.db.insert("spotifyCredentials", {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
      });
    }
  },
});

// ============ Public Mutation for Initial Setup ============

export const initializeTokens = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresIn: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    const expiresAt = Date.now() + args.expiresIn * 1000;
    const existing = await ctx.db.query("spotifyCredentials").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt,
      });
    } else {
      await ctx.db.insert("spotifyCredentials", {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt,
      });
    }
  },
});

// ============ Get Now Playing Action ============

async function refreshToken(
  refreshTokenValue: string
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
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
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

export const getNowPlaying = action({
  args: {},
  handler: async (ctx): Promise<NowPlayingData | null> => {
    let credentials = await ctx.runQuery(internal.spotify.getCredentialsInternal);

    if (!credentials) {
      return null;
    }

    // Refresh token if expired or expiring within 5 minutes
    const REFRESH_BUFFER_MS = 5 * 60 * 1000;
    if (credentials.expiresAt < Date.now() + REFRESH_BUFFER_MS) {
      const newTokens = await refreshToken(credentials.refreshToken);
      if (!newTokens) {
        return null;
      }
      await ctx.runMutation(internal.spotify.updateTokensInternal, newTokens);
      credentials = { ...credentials, ...newTokens };
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      }
    );

    // 204 = No content (nothing playing)
    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      console.error("Spotify API error:", response.status);
      return null;
    }

    const data: SpotifyCurrentlyPlayingResponse = await response.json();

    // Only handle tracks (not episodes/ads)
    if (!data.item || data.currently_playing_type !== "track") {
      return null;
    }

    const track = data.item;

    return {
      isPlaying: data.is_playing,
      trackName: track.name,
      artistName: track.artists.map((a) => a.name).join(", "),
      durationMs: track.duration_ms,
      albumName: track.album.name,
      albumArt: track.album.images[0]?.url ?? "",
      trackUrl: track.external_urls.spotify,
      progressMs: data.progress_ms,
    };
  },
});

