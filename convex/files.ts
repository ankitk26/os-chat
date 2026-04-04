import { v } from "convex/values";
import { query } from "./_generated/server";

const getStorageUrl = query({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		return ctx.storage.getUrl(args.storageId);
	},
});

export const getFileUrl = getStorageUrl;
export const getImageUrl = getStorageUrl;
