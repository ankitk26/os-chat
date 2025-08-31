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

  folders: defineTable({
    title: v.string(),
    userId: v.id("user"),
    defaultModel: v.object({
      id: v.string(),
      name: v.string(),
    }),
  }).index("by_user", ["userId"]),

  chats: defineTable({
    uuid: v.string(),
    title: v.string(),
    userId: v.id("user"),
    isPinned: v.boolean(),
    isBranched: v.boolean(),
    parentChatId: v.optional(v.id("chats")),
    folderId: v.optional(v.id("folders")),
  })
    .index("by_chat_uuid", ["uuid"])
    .index("by_user", ["userId"])
    .index("by_user_and_pinned_and_folder", ["userId", "isPinned", "folderId"])
    .index("by_folder_and_user", ["userId", "folderId"]),

  messages: defineTable({
    sourceMessageId: v.optional(v.string()),
    chatId: v.string(),
    userId: v.id("user"),
    parts: v.string(),
    annotations: v.optional(v.string()),
    metadata: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
  })
    .index("by_user_chat", ["chatId", "userId"])
    .index("by_chat", ["chatId"])
    .index("by_source_id", ["sourceMessageId"]),

  sharedChats: defineTable({
    parentChatUuid: v.string(),
    uuid: v.string(),
    isActive: v.boolean(),
    updatedTime: v.number(),
  })
    .index("by_parent_chat", ["parentChatUuid"])
    .index("by_uuid", ["uuid"]),
});
