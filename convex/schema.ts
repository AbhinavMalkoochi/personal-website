import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spotifyCredentials: defineTable({
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(), // Unix timestamp in ms
  }),
});
