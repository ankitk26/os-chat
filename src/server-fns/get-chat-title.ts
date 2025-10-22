import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

export const getChatTitle = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      userMessage: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { text: generatedTitle } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      system:
        "You are a professional writer. " +
        "You write simple, clear, and concise content. " +
        "Your task is to create a title that accurately reflects the user's message, is easy to understand, and does not exceed 10 words.",
      prompt:
        "Generate a concise and informative title for the following user message. The title should summarize the core subject or intent of the message. Avoid conversational phrases in the title." +
        "\n\n" +
        "\n\n" +
        "Examples:" +
        "\n" +
        // Scenario 1 Example
        "User message: 'I need to submit a request to extend the deadline for the Q3 project. Can you tell me the process for that?'" +
        "\n" +
        "Title: Q3 Project Deadline Extension Request" +
        "\n\n" +
        // Scenario 2 Example
        "User message: 'I'm thinking about how we can add a new photo editing filter to the app. What are your thoughts on integrating AI for this?'" +
        "\n" +
        "Title: New Photo Editing Feature Brainstorming" +
        "\n\n" +
        "Here is the user message - " +
        data.userMessage,
    });

    return generatedTitle;
  });
