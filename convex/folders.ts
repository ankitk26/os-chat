import { v } from "convex/values";
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

export const createFolder = mutation({
  args: { sessionToken: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    await ctx.db.insert("folders", {
      userId: userId,
      title: args.title,
    });
  },
});

export const updateFolder = mutation({
  args: {
    sessionToken: v.string(),
    folder: v.object({ folderId: v.id("folders"), title: v.string() }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const folder = await ctx.db.get(args.folder.folderId);
    if (!folder) {
      throw new Error("Invalid folder");
    }

    if (folder.userId !== userId) {
      throw new Error("Unauthorized request");
    }

    await ctx.db.patch(args.folder.folderId, { title: args.folder.title });
  },
});

export const deleteFolder = mutation({
  args: {
    sessionToken: v.string(),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new Error("Invalid folder");
    }

    if (folder.userId !== userId) {
      throw new Error("Unauthorized request");
    }

    await ctx.db.delete(args.folderId);
  },
});
