import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  account: defineTable({
    accessToken: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    scope: v.string(),
    updatedAt: v.string(),
    userId: v.id("user"),
  }),

  session: defineTable({
    expiresAt: v.string(),
    ipAddress: v.string(),
    token: v.string(),
    updatedAt: v.string(),
    userAgent: v.string(),
    userId: v.id("user"),
  }),

  user: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.string(),
    name: v.string(),
    updatedAt: v.string(),
  }),

  chats: defineTable({
    uuid: v.string(),
    title: v.string(),
    userId: v.id("user"),
    isPinned: v.union(v.literal(true), v.literal(false)),
  })
    .index("by_chat_uuid", ["uuid"])
    .index("by_user", ["userId"])
    .index("by_user_and_pinned", ["userId", "isPinned"]),

  messages: defineTable({
    chatId: v.string(),
    userId: v.id("user"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    model: v.optional(v.string()),
  }).index("by_user_chat", ["chatId", "userId"]),
});
