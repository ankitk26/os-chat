import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import {
  createDataStreamResponse,
  Message,
  smoothStream,
  streamText,
} from "ai";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const {
      messages,
      model,
      isWebSearchEnabled,
    }: { messages: Message[]; model: string; isWebSearchEnabled: boolean } =
      await request.json();

    const systemMessage =
      "You are a helpful and concise assistant. Your primary goal is to provide clear and direct answers to the user's questions.\n" +
      "\n" +
      "**All mathematical expressions and equations in your response MUST be rendered as high-quality LaTeX. Follow these specific formatting guidelines for math:**\n" +
      "- **Inline math:** Use `\\( content \\)`. Example: `\\( E=mc^2 \\)`.\n" +
      "- **Display math:** Use `$$ content $$`.\n" +
      "- **Avoid single dollars:** Never use `$` for math.\n" +
      "- **Math variables:** Always wrap single variables in inline math, e.g., for `a`, use `\\(a\\)`, not `(a)`.\n" +
      "- **Correct LaTeX commands:** Use `\\frac`, `\\sqrt`, `\\degree`, etc.\n" +
      "- **Conditional/Piecewise functions (e.g., if/else logic):** ALWAYS use the `cases` environment, ensuring it is syntactically COMPLETE.\n" +
      "  - **Start** every `cases` block with `$$\\begin{cases}`.\n" +
      "  - **End** every `cases` block with `\\end{cases}$$`.\n" +
      "  - Use `&` to separate columns (expression and condition).\n" +
      "  - Use `\\\\` for new lines within `cases`.\n" +
      "  - Wrap descriptive text (like 'if condition') within `cases` using `\\text{...}`. Example: `\\text{if condition}`.\n" +
      "  - Full `cases` example:\n" +
      "    ```latex\n" +
      "    $$\n" +
      "    f(x) = \\begin{cases}\n" +
      "    x^2 & \\text{if } x \\ge 0 \\\\\n" +
      "    -x & \\text{otherwise}\n" +
      "    \\end{cases}\n" +
      "    $$\n" +
      "    ```\n" +
      "\n" +
      "**IMPORTANT: UNDER NO CIRCUMSTANCES should you mention LaTeX, formatting rules, code, commands, or any technical implementation details in your response to the user. Your response should read as if you are directly providing information, not explaining how it's formatted. For instance, say 'Here is the formula:' instead of 'Here is the LaTeX code for the formula:'.**";

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: google(model, {
            useSearchGrounding: isWebSearchEnabled,
          }),
          system: systemMessage,
          messages,
          experimental_transform: smoothStream({
            chunking: "line",
          }),
          abortSignal: request.signal,
          onFinish() {
            dataStream.writeMessageAnnotation({ model });
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  },
});
