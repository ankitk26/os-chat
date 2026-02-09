import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

export const getChatTitle = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			userMessage: z.string().trim().min(1),
		}),
	)
	.handler(async ({ data }) => {
		const { text: generatedTitle } = await generateText({
			model: google("gemini-2.5-flash-lite"),
			system:
				"You generate short chat titles. " +
				"Return ONLY the title text (no labels like 'Title:' and no quotes). " +
				"Use 2-10 words. " +
				"No conversational filler.",
			prompt:
				"Write a concise title for this user message:\n\n" +
				"'''\n" +
				data.userMessage +
				"\n'''\n\n" +
				"Return only the title.",
		});

		return generatedTitle;
	});
