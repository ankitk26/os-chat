import { internalMutation } from "convex/functions";

export const setAnnotationsUndefined = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      await ctx.db.patch(message._id, {
        annotations: undefined,
      });
    }
  },
});
