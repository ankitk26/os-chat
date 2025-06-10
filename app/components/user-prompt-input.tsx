import type { ChatRequestOptions } from "ai";
import { PaperclipIcon, SendIcon, SquareIcon } from "lucide-react";
import type React from "react";
import { modelProviders } from "~/constants/model-providers";
import { useModelStore } from "~/stores/model-store";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const { model, setModel } = useModelStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-3xl p-4 mx-auto border rounded-tl-lg rounded-tr-lg dark:border-0 min-h-32 bg-secondary"
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
          <Select value={model} onValueChange={(val) => setModel(val)}>
            <SelectTrigger className="shadow-none dark:border-0 hover:bg-card">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gemini</SelectLabel>
                {modelProviders.map((model) => (
                  <SelectItem key={model.modelId} value={model.modelId}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
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
