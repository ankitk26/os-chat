import { mutation } from "convex/_generated/server";

export const setIsBranchedOff = mutation({
  handler: async (ctx) => {
    const chats = await ctx.db.query("chats").collect();
    for (const chat of chats) {
      await ctx.db.patch(chat._id, { isBranched: false });
    }
  },
});
