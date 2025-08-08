import { CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: string;
};

export default React.memo(function UserMessage({ message }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex w-3/4 flex-col items-end space-y-1 self-end">
      <div
        className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message}
      </div>
      <div
        className={cn(
          "flex transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* {!readOnly && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <RefreshCcwIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Retry message</TooltipContent>
          </Tooltip>
        )} */}

        {/* {!readOnly && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <Edit2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit message</TooltipContent>
          </Tooltip>
        )} */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(message);
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
});
