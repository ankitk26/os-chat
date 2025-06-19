import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";

export const getChatTitle = createServerFn({ method: "GET" })
  .validator((userMessage: string) => userMessage)
  .handler(async ({ data: userMessage }) => {
    console.log(userMessage);

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      schema: z.object({
        title: z.string(),
      }),
      system:
        "You are a professional writer. " +
        "You write simple, clear, and concise content. " +
        "Your task is to create a title that accurately reflects the user's message, is easy to understand, and does not exceed 10 words.",
      prompt:
        "Generate a concise and informative title for the following user message. The title should summarize the core subject or intent of the message. Avoid conversational phrases in the title." +
        "\n\n" +
        "Here is the message - " +
        userMessage +
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
        "Title: New Photo Editing Feature Brainstorming",
    });

    return object.title;
  });
