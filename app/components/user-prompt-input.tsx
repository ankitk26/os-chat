import type { ChatRequestOptions } from "ai";
import type React from "react";
import AutoResizeTextarea from "./auto-resize-textarea";
import PromptActions from "./prompt-actions";

type Props = {
  chatId: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
};

export default function UserPromptInput(props: Props) {
  const { chatId, input, setInput, handleSubmit, status, stop } = props;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-3xl p-4 mx-auto border rounded-tl-lg rounded-tr-lg border-border/50 min-h-32 bg-card"
    >
      <div className="flex-1">
        <AutoResizeTextarea
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />
      </div>

      <PromptActions status={status} stop={stop} />
    </form>
  );
}
