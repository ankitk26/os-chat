import { Session } from "better-auth";
import { internal } from "../_generated/api";
import { QueryCtx } from "../_generated/server";
import { Id } from "convex/_generated/dataModel";

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
