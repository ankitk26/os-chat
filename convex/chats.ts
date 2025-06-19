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

    for await (const message of ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chat.uuid))) {
      await ctx.db.delete(message._id);
    }

    for await (const sharedChat of ctx.db
      .query("sharedChats")
      .withIndex("by_parent_chat", (q) => q.eq("parentChatUuid", chat.uuid))) {
      await ctx.db.delete(sharedChat._id);
    }
  },
});

export const createSharedChat = mutation({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
    sharedChatUuid: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Invalid request");
    }

    // check if an existing sharedChat already exists
    const sharedChat = await ctx.db
      .query("sharedChats")
      .withIndex("by_parent_chat", (q) => q.eq("parentChatUuid", chat.uuid))
      .first();
    if (sharedChat) {
      // if sharedChat is active, deactivate it
      await ctx.db.patch(sharedChat._id, { isActive: !sharedChat.isActive });
      if (sharedChat.isActive) {
        return null;
      } else {
        return sharedChat.uuid;
      }
    }

    // if no shared chat exists, then create one
    await ctx.db.insert("sharedChats", {
      parentChatUuid: chat.uuid,
      isActive: true,
      uuid: args.sharedChatUuid,
    });

    return args.sharedChatUuid;
  },
});

export const getSharedChatStatus = query({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const sharedChat = await ctx.db
      .query("sharedChats")
      .withIndex("by_parent_chat", (q) => q.eq("parentChatUuid", chat.uuid))
      .first();

    return sharedChat && sharedChat.isActive ? sharedChat.uuid : null;
  },
});
