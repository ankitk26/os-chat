import type { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: Doc<"messages">;
};

export default function ReadOnlyUserMessage({ message }: Props) {
  return (
    <div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
      {/* Message bubble */}
      <div className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4">
        {message.content}
      </div>

      {/* Copy button container */}
      <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(message.content);
                toast.success("Copied to clipboard");
              }}
              size="icon"
              variant="ghost"
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
