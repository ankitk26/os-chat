import { ChatRequestOptions } from "ai";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
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
  handleInputChange,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-tl-lg p-4 rounded-tr-lg h-32 flex flex-col bg-input/40"
    >
      <div className="flex-1">
        <input
          value={input}
          placeholder="Ask here..."
          onChange={handleInputChange}
          className="resize-none focus:outline-none w-full"
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
