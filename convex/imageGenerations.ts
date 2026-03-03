import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

export const getAll = query({
	handler: async (ctx) => {
		const authUserId = await getAuthUserIdOrThrow(ctx);

		const imageGenerations = await ctx.db
			.query("imageGenerations")
			.withIndex("by_user", (q) => q.eq("userId", authUserId))
			.collect();

		return imageGenerations;
	},
});

export const create = mutation({
	args: {
		storageId: v.id("_storage"),
		generatedImageUrl: v.string(),
	},
	handler: async (ctx, args) => {
		const authUserId = await getAuthUserIdOrThrow(ctx);

		await ctx.db.insert("imageGenerations", {
			userId: authUserId,
			storageId: args.storageId,
			generatedImageUrl: args.generatedImageUrl,
		});
	},
});
