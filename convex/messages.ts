import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

export const getMessages = query({
  args: { sessionToken: v.string(), chatId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("chatId", args.chatId).eq("userId", userId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

export const getSharedChatMessages = query({
  args: {
    sharedChatUuid: v.string(),
  },
  handler: async (ctx, args) => {
    const sharedChat = await ctx.db
      .query("sharedChats")
      .withIndex("by_uuid", (q) => q.eq("uuid", args.sharedChatUuid))
      .first();

    if (!sharedChat) {
      return null;
    }

    if (!sharedChat.isActive) {
      return null;
    }

    const parentChat = await ctx.db
      .query("chats")
      .withIndex("by_chat_uuid", (q) => q.eq("uuid", sharedChat.parentChatUuid))
      .first();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) =>
        q
          .eq("chatId", sharedChat.parentChatUuid)
          .lte("_creationTime", sharedChat.updatedTime)
      )
      .order("asc")
      .collect();

    return { sharedChat, messages, parentChat };
  },
});

export const createMessage = mutation({
  args: {
    sessionToken: v.string(),
    messageBody: v.object({
      sourceMessageId: v.optional(v.string()),
      chatId: v.string(),
      parts: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      annotations: v.string(),
      metadata: v.optional(v.string())
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    await ctx.db.insert("messages", {
      sourceMessageId: args.messageBody.sourceMessageId,
      chatId: args.messageBody.chatId,
      parts: args.messageBody.parts,
      annotations: args.messageBody.annotations,
      role: args.messageBody.role,
      userId,
      metadata: args.messageBody.metadata
    });

    return args.messageBody.chatId;
  },
});

export const deleteMessagesByTimestamp = mutation({
  args: {
    sessionToken: v.string(),
    currentMessageSourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const currentMessage = await ctx.db
      .query("messages")
      .withIndex("by_source_id", (q) =>
        q.eq("sourceMessageId", args.currentMessageSourceId)
      )
      .first();

    if (!currentMessage) {
      throw new Error("Invalid message");
    }

    if (currentMessage.userId !== userId) {
      throw new Error("Unauthorized access");
    }

    for await (const message of ctx.db
      .query("messages")
      .withIndex("by_creation_time", (q) =>
        q.gte("_creationTime", currentMessage._creationTime)
      )) {
      await ctx.db.delete(message._id);
    }
  },
});

export const deleteMessagesByChat = internalMutation({
  args: {
    chatId: v.string(),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const BATCH_SIZE = 500;
    const {
      page: messages,
      isDone,
      continueCursor,
    } = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .paginate({ numItems: BATCH_SIZE, cursor: args.cursor ?? null });

    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    if (!isDone) {
      // Schedule next batch using the continueCursor
      await ctx.scheduler.runAfter(0, internal.messages.deleteMessagesByChat, {
        chatId: args.chatId,
        cursor: continueCursor,
      });
    }
  },
});
