import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

export const getChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return chats;
  },
});

export const getUnpinnedChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_and_pinned", (q) =>
        q.eq("userId", userId).eq("isPinned", false)
      )
      .order("desc")
      .collect();

    return chats;
  },
});

export const getPinnedChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_and_pinned", (q) =>
        q.eq("userId", userId).eq("isPinned", true)
      )
      .order("desc")
      .collect();

    return chats;
  },
});

export const createChat = mutation({
  args: { sessionToken: v.string(), uuid: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const newChatId = await ctx.db.insert("chats", {
      uuid: args.uuid,
      userId: userId,
      title: "Title for chat",
      isPinned: false,
    });

    return newChatId;
  },
});

export const updateChatTitle = mutation({
  args: {
    sessionToken: v.string(),
    chat: v.object({
      chatId: v.id("chats"),
      title: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await getAuthUserIdOrThrow(ctx, args.sessionToken);
    await ctx.db.patch(args.chat.chatId, { title: args.chat.title });
  },
});

export const toggleChatPin = mutation({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    await getAuthUserIdOrThrow(ctx, args.sessionToken);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Invalid chat request");
    }
    await ctx.db.patch(args.chatId, { isPinned: !chat.isPinned });
    return chat.isPinned;
  },
});

export const deleteChat = mutation({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Invalid chat");
    }

    if (chat.userId !== userId) {
      throw new Error("Unauthorized request");
    }

    await ctx.db.delete(args.chatId);
  },
});
