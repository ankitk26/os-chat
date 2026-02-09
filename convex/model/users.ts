import type { Id } from "convex/_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export const getAuthUserIdOrThrow = async (
  ctx: QueryCtx,
): Promise<Id<"users">> => {
  const auth = await ctx.auth.getUserIdentity();
  if (!auth) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth", (q) => q.eq("authId", auth.subject))
    .first();

  if (!user) {
    throw new Error("Unauthorized");
  }
  return user._id;
};
