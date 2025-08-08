import { mutation } from "convex/_generated/server";

export const setIsBranchedOff = mutation({
  handler: async (ctx) => {
    const chats = await ctx.db.query("chats").collect();
    await Promise.all(
      chats.map((chat) => ctx.db.patch(chat._id, { isBranched: false }))
    );
  },
});
