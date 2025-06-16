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

export const createChat = mutation({
  args: { sessionToken: v.string(), uuid: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const newChatId = await ctx.db.insert("chats", {
      uuid: args.uuid,
      userId: userId,
      title: "Random title 1",
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

export const moveToFolder = mutation({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
    targetFolderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    await getAuthUserIdOrThrow(ctx, args.sessionToken);
    await ctx.db.patch(args.chatId, { folderId: args.targetFolderId });
  },
});
