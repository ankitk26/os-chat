import type { AuthFunctions, GenericCtx } from "@convex-dev/better-auth";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import type { DataModel } from "./_generated/dataModel";
import { components, internal } from "./_generated/api";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
	authFunctions,
	triggers: {
		user: {
			onCreate: async (ctx, doc) => {
				await ctx.db.insert("users", {
					email: doc.email,
					authId: doc._id,
					updatedAtTime: Date.now(),
				});
			},
			onUpdate: async (ctx, newDoc) => {
				if (!newDoc) {
					return;
				}
				const user = await ctx.db
					.query("users")
					.withIndex("by_auth", (q) => q.eq("authId", newDoc._id))
					.first();

				if (!user) {
					return;
				}

				await ctx.db.patch(user._id, {
					email: newDoc.email,
					updatedAtTime: Date.now(),
				});
			},
		},
	},
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 60 * 30, // cache duration in seconds - 30 minutes
			},
		},
		socialProviders: {
			github: {
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			},
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig }),
		],
	});
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return await authComponent.getAuthUser(ctx);
	},
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
