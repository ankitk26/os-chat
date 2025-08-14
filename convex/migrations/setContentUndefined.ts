import { mutation } from "convex/_generated/server";

// run this on all environments
export const setContentUndefined = mutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    await Promise.all(
      messages.map((message) =>
        ctx.db.patch(message._id, { content: undefined })
      )
    );
  },
});
