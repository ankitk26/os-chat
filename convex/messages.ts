import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
      throw new Error("Invalid request");
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
          .lte("_creationTime", sharedChat._creationTime)
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
      content: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      model: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    await ctx.db.insert("messages", {
      sourceMessageId: args.messageBody.sourceMessageId,
      chatId: args.messageBody.chatId,
      content: args.messageBody.content,
      model: args.messageBody.model,
      role: args.messageBody.role,
      userId: userId,
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
    const user = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const currentMessage = await ctx.db
      .query("messages")
      .withIndex("by_source_id", (q) =>
        q.eq("sourceMessageId", args.currentMessageSourceId)
      )
      .first();

    if (!currentMessage) {
      throw new Error("Invalid message");
    }

    if (currentMessage.userId !== user) {
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
