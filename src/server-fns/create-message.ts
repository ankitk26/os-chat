import { createServerFn } from "@tanstack/react-start";
import { api } from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { getAuth } from "./get-auth";

export const createMessageServerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      chatId: z.string(),
      parts: z.string(),
      metadata: z.string().default(""),
      messageId: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const authData = await getAuth();
    if (!authData?.session) {
      throw new Error("Invalid request");
    }

    const convexClient = new ConvexHttpClient(
      process.env.VITE_CONVEX_URL as string
    );
    await convexClient.mutation(api.messages.createMessage, {
      messageBody: {
        chatId: data.chatId,
        parts: data.parts,
        role: "assistant",
        metadata: data.metadata,
        sourceMessageId: data.messageId,
      },
      sessionToken: authData.session.token,
    });
  });
