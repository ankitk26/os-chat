import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import type React from "react";
import AutoResizeTextarea from "./auto-resize-textarea";
import PromptActions from "./prompt-actions";

type Props = {
  chatId: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default function UserPromptInput(props: Props) {
  const { chatId, input, setInput, status, stop, append } = props;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col w-full max-w-3xl p-4 mx-auto border rounded-lg border-border min-h-32"
    >
      <div className="flex-1">
        <AutoResizeTextarea
          chatId={chatId}
          input={input}
          append={append}
          setInput={setInput}
        />
      </div>

      <PromptActions status={status} stop={stop} />
    </form>
  );
}
