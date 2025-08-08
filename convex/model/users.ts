import type { Session } from "better-auth";
import type { Id } from "convex/_generated/dataModel";
import { internal } from "../_generated/api";
import type { QueryCtx } from "../_generated/server";

export const getAuthUserIdOrThrow = async (
  ctx: QueryCtx,
  sessionToken: string
): Promise<Id<"user">> => {
  const session: Session | null = await ctx.runQuery(
    internal.betterAuth.getSession,
    {
      sessionToken,
    }
  );
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.userId as Id<"user">;
};
