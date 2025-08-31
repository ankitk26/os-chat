import { internalMutation } from "convex/functions";

export const convertAnnotationsToMetadata = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      if (message.role === "user" || message.annotations === "") {
        continue;
      }
      const parsedAnnotation = JSON.parse(message.annotations ?? "[]");
      console.log(parsedAnnotation);
      if (!parsedAnnotation || parsedAnnotation.length === 0) {
        continue;
      }
      const modelUsed = parsedAnnotation[0].data;
      const createdAt = message._creationTime;
      const metadata = {
        model: modelUsed,
        createdAt,
      };
      await ctx.db.patch(message._id, {
        metadata: JSON.stringify(metadata),
      });
    }
  },
});
