import { internalMutation } from "convex/functions";
import { generateRandomUUID } from "~/lib/generate-random-uuid";

export const assignMessageUuid = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("asc").collect();
    for (const message of messages) {
      if (
        !message.sourceMessageId ||
        message.sourceMessageId.startsWith("msg-")
      ) {
        const randomId = generateRandomUUID();
        await ctx.db.patch(message._id, {
          sourceMessageId: randomId,
        });
      }
    }
  },
});
