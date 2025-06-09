import type { ChatRequestOptions } from "ai";
import { PaperclipIcon, SendIcon } from "lucide-react";
import type React from "react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { Button } from "./ui/button";

type Props = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
};

export default function UserPromptInput({
  input,
  handleSubmit,
  setInput,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-tl-lg p-4 rounded-tr-lg min-h-32 flex flex-col bg-input/40"
    >
      <div className="flex-1">
        <AutoResizeTextarea
          value={input}
          placeholder="Start the conversation..."
          onChange={(val) => setInput(val)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-sm">Gemini Flash 2.0</div>
          <Button size="sm" variant="outline">
            <PaperclipIcon />
            <span>Attach</span>
          </Button>
        </div>
        <Button size="icon" type="submit" className="size-9">
          <SendIcon />
        </Button>
      </div>
    </form>
  );
}
