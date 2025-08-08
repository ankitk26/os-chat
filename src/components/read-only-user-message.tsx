import type { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: Doc<"messages">;
};

export default function ReadOnlyUserMessage({ message }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex w-3/4 flex-col items-end space-y-1 self-end">
      <div
        className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message.content}
      </div>
      <div
        className={cn(
          "flex transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
