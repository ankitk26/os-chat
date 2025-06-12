import type { ChatRequestOptions } from "ai";
import { GlobeIcon, PaperclipIcon, SendIcon, SquareIcon } from "lucide-react";
import type React from "react";
import { cn } from "~/lib/utils";
import { useModelStore } from "~/stores/model-store";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import ModelSelector from "./model-selector";
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
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
};

export default function UserPromptInput(props: Props) {
  const { input, handleSubmit, setInput, status, stop } = props;
  const model = useModelStore((store) => store.model);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
  const toggleIsWebSearch = useModelStore((store) => store.toggleIsWebSearch);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, {
        body: {
          model,
          isWebSearchEnabled,
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-3xl p-4 mx-auto border rounded-tl-lg rounded-tr-lg border-border/50 min-h-32 bg-card"
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
          <ModelSelector />
          <Button
            type="button"
            size="sm"
            variant={isWebSearchEnabled ? "default" : "outline"}
            className={cn("rounded-full", isWebSearchEnabled ? "border" : "")}
            onClick={toggleIsWebSearch}
          >
            <GlobeIcon />
            <span>Search</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            <PaperclipIcon />
            <span>Attach</span>
          </Button>
        </div>
        {status === "streaming" || status === "submitted" ? (
          <Button size="icon" type="submit" className="size-9" onClick={stop}>
            <SquareIcon />
          </Button>
        ) : (
          <Button size="icon" type="submit" className="size-9">
            <SendIcon />
          </Button>
        )}
      </div>
    </form>
  );
}
