import { query } from "./_generated/server";
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
