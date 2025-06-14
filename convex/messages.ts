import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserIdOrThrow } from "./model/users";

export const getMessages = query({
  args: { sessionToken: v.string(), chatId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("chatId", args.chatId).eq("userId", userId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

export const createMessage = mutation({
  args: {
    sessionToken: v.string(),
    messageBody: v.object({
      chatId: v.string(),
      content: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      model: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrThrow(ctx, args.sessionToken);

    await ctx.db.insert("messages", {
      chatId: args.messageBody.chatId,
      content: args.messageBody.content,
      model: args.messageBody.model,
      role: args.messageBody.role,
      userId: userId,
    });

    return args.messageBody.chatId;
  },
});
