import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const messageFields = {
  chatId: v.id("chats"),
  userId: v.id("user"),
  content: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant")),
  model: v.optional(v.string()),
};

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
    title: v.string(),
    userId: v.id("user"),
  }).index("by_user", ["userId"]),
  messages: defineTable(messageFields).index("by_user_chat", [
    "chatId",
    "userId",
  ]),
});
