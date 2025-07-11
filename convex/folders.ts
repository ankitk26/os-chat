import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

export const getFolders = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return folders;
  },
});

export const getFoldersWithChats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const foldersWithChats = await Promise.all(
      folders.map(async (folder) => {
        const chats = await ctx.db
          .query("chats")
          .withIndex("by_folder_and_user", (q) =>
            q.eq("userId", userId).eq("folderId", folder._id)
          )
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
        return { ...folder, chats: chatsWithParent };
      })
    );

    return foldersWithChats;
  },
});

export const createFolder = mutation({
  args: {
    sessionToken: v.string(),
    title: v.string(),
    defaultModel: v.optional(v.object({ id: v.string(), name: v.string() })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const defaultModel = {
      id: "gemini-2.0-flash-001",
      name: "Gemini 2.0 Flash",
    };

    await ctx.db.insert("folders", {
      defaultModel,
      title: args.title,
      userId,
    });
  },
});

export const deleteFolder = mutation({
  args: {
    sessionToken: v.string(),
    folderId: v.id("folders"),
    deleteChatsFlag: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    if (args.deleteChatsFlag) {
      await ctx.scheduler.runAfter(0, internal.chats.deleteChatsByFolder, {
        userId,
        folderId: args.folderId,
        cursor: null,
      });
    } else {
      // Update all chats in the folder to remove folderId
      const BATCH_SIZE = 500;
      let cursor: string | null = null;
      let isDone = false;

      while (!isDone) {
        const {
          page: chats,
          isDone: batchDone,
          continueCursor,
        } = await ctx.db
          .query("chats")
          .withIndex("by_folder_and_user", (q) =>
            q.eq("userId", userId).eq("folderId", args.folderId)
          )
          .paginate({ numItems: BATCH_SIZE, cursor });

        for (const chat of chats) {
          await ctx.db.patch(chat._id, { folderId: undefined });
        }

        isDone = batchDone;
        cursor = continueCursor;
      }
    }

    await ctx.db.delete(args.folderId);
  },
});

export const renameFolder = mutation({
  args: {
    sessionToken: v.string(),
    folder: v.object({
      id: v.id("folders"),
      title: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await getAuthUserIdOrThrow(ctx, args.sessionToken);
    await ctx.db.patch(args.folder.id, { title: args.folder.title });
  },
});
