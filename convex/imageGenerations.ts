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
		generatedImageUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const authUserId = await getAuthUserIdOrThrow(ctx);
		// Allow callers to omit the URL and derive it from storage after upload.
		const generatedImageUrl =
			args.generatedImageUrl ?? (await ctx.storage.getUrl(args.storageId));
		if (!generatedImageUrl) {
			throw new Error("Could not generate image URL");
		}

		await ctx.db.insert("imageGenerations", {
			userId: authUserId,
			storageId: args.storageId,
			generatedImageUrl,
		});

		return generatedImageUrl;
	},
});

export const deleteImage = mutation({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const authUserId = await getAuthUserIdOrThrow(ctx);

		const image = await ctx.db
			.query("imageGenerations")
			.withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
			.first();

		if (!image) {
			throw new Error("invalid image");
		}

		if (image.userId !== authUserId) {
			throw new Error("invalid request");
		}

		await ctx.db.delete("imageGenerations", image._id);
		await ctx.storage.delete(args.storageId);
	},
});
