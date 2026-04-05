import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

const getStorageUrl = query({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserIdOrThrow(ctx);
		const image = await ctx.db
			.query("imageGenerations")
			.withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
			.first();

		// Generated images are owned through the gallery table.
		if (image?.userId === userId) {
			return ctx.storage.getUrl(args.storageId);
		}

		const uploadedFile = await ctx.db
			.query("uploadedFiles")
			.withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
			.first();

		// Prompt attachments are owned through uploadedFiles.
		if (uploadedFile?.userId !== userId) {
			throw new Error("Unauthorized access");
		}

		return ctx.storage.getUrl(args.storageId);
	},
});

export const getFileUrl = getStorageUrl;
export const getImageUrl = getStorageUrl;
