import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spotifyCredentials: defineTable({
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
  }),

  spotifyNowPlaying: defineTable({
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
  }),

  spotifyPollState: defineTable({
    lockUntil: v.number(),
    nextAllowedPollAt: v.number(),
    lastAttemptAt: v.number(),
    lastSuccessAt: v.number(),
  }),
});
