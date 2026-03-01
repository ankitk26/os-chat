import { v } from "convex/values";
import { query } from "./_generated/server";

export const getImageUrl = query({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		return ctx.storage.getUrl(args.storageId);
	},
});
