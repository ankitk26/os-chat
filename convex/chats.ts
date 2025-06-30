import { v } from "convex/values";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { internal } from "./_generated/api";
import { query } from "./_generated/server";
import { internalMutation, mutation } from "./functions";
import { getAuthUserIdOrThrow } from "./model/users";

export const getChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_and_pinned_and_folder", (q) => q.eq("userId", userId))
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
      .withIndex("by_user_and_pinned_and_folder", (q) =>
        q.eq("userId", userId).eq("isPinned", false).eq("folderId", undefined)
      )
      .order("desc")
      .collect();

    const chatsWithParent = await Promise.all(
      chats.map(async (chat) => {
        if (chat.isBranched && chat.parentChatId) {
          const parentChat = await ctx.db.get(chat.parentChatId);
          return {
            ...chat,
            parentChat: {
              id: parentChat?._id,
              uuid: parentChat?.uuid,
              title: parentChat?.title,
            },
          };
        }
        return { ...chat, parentChat: null };
      })
    );

    return chatsWithParent;
  },
});

export const getPinnedChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_and_pinned_and_folder", (q) =>
        q.eq("userId", userId).eq("isPinned", true).eq("folderId", undefined)
      )
      .order("desc")
      .collect();

    const chatsWithParent = await Promise.all(
      chats.map(async (chat) => {
        if (chat.isBranched && chat.parentChatId) {
          const parentChat = await ctx.db.get(chat.parentChatId);
          return {
            ...chat,
            parentChat: {
              id: parentChat?._id,
              uuid: parentChat?.uuid,
              title: parentChat?.title,
            },
          };
        }
        return { ...chat, parentChat: null };
      })
    );

    return chatsWithParent;
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
      isBranched: false,
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

export const deleteSharedChatsByParentChat = internalMutation({
  args: {
    chatId: v.string(),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const BATCH_SIZE = 500;
    const {
      page: chats,
      isDone,
      continueCursor,
    } = await ctx.db
      .query("sharedChats")
      .withIndex("by_parent_chat", (q) => q.eq("parentChatUuid", args.chatId))
      .paginate({ numItems: BATCH_SIZE, cursor: args.cursor ?? null });

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    if (!isDone) {
      // Schedule next batch using the continueCursor
      await ctx.scheduler.runAfter(
        0,
        internal.chats.deleteSharedChatsByParentChat,
        {
          chatId: args.chatId,
          cursor: continueCursor,
        }
      );
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
    await getAuthUserIdOrThrow(ctx, args.sessionToken);

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
      updatedTime: Date.now(),
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

export const syncSharedChat = mutation({
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

    if (!sharedChat) {
      throw new Error("No shared chat found");
    }

    await ctx.db.patch(sharedChat._id, { updatedTime: Date.now() });
  },
});

export const branchOffChat = mutation({
  args: {
    sessionToken: v.string(),
    parentChatUuid: v.string(),
    branchedChatUuid: v.string(),
    lastMessageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    // get the chat being branched
    const parentChat = await ctx.db
      .query("chats")
      .withIndex("by_chat_uuid", (q) => q.eq("uuid", args.parentChatUuid))
      .first();

    // check if chat exists
    if (!parentChat) {
      throw new Error("Invalid chat");
    }

    // create duplicate chat record with same details as original chat
    const branchedChatId = await ctx.db.insert("chats", {
      isBranched: true, // flag = true
      isPinned: false,
      title: parentChat.title,
      userId: user,
      uuid: args.branchedChatUuid,
      parentChatId: parentChat._id,
      // parentChatUuid: parentChat.uuid,
    });

    // get newly inserted branched chat
    const branchedChat = await ctx.db.get(branchedChatId);

    // throw error if not found
    if (!branchedChat) {
      throw new Error("Branched chat not found!");
    }

    // get message at which chat was branched off
    const lastMessage = await ctx.db
      .query("messages")
      .withIndex("by_source_id", (q) =>
        q.eq("sourceMessageId", args.lastMessageId)
      )
      .first();

    // throw error if message not found
    if (!lastMessage) {
      throw new Error("Message not found");
    }

    // get all messages before the message on which chat was branched off
    const messagesTillBranchedMessage = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) =>
        q
          .eq("chatId", parentChat.uuid)
          .lte("_creationTime", lastMessage._creationTime)
      )
      .collect();

    // insert parent chat's messages but for new branchedChat
    for (const message of messagesTillBranchedMessage) {
      const newMessageId = generateRandomUUID();

      await ctx.db.insert("messages", {
        annotations: message.annotations,
        chatId: branchedChat.uuid,
        content: message.content,
        parts: message.parts,
        role: message.role,
        userId: user,
        sourceMessageId: newMessageId,
      });
    }
  },
});

export const updateChatFolder = mutation({
  args: {
    sessionToken: v.string(),
    chatId: v.id("chats"),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    await getAuthUserIdOrThrow(ctx, args.sessionToken);
    await ctx.db.patch(args.chatId, { folderId: args.folderId });
  },
});

export const deleteChatsByFolder = internalMutation({
  args: {
    userId: v.id("user"),
    folderId: v.id("folders"),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const BATCH_SIZE = 500;
    const {
      page: chats,
      isDone,
      continueCursor,
    } = await ctx.db
      .query("chats")
      .withIndex("by_folder_and_user", (q) =>
        q.eq("userId", args.userId).eq("folderId", args.folderId)
      )
      .paginate({ numItems: BATCH_SIZE, cursor: args.cursor ?? null });

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    if (!isDone) {
      // Schedule next batch
      await ctx.scheduler.runAfter(0, internal.chats.deleteChatsByFolder, {
        userId: args.userId,
        folderId: args.folderId,
        cursor: continueCursor,
      });
    }
  },
});
