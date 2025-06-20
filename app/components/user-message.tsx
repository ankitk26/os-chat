import { CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: string;
  readOnly?: boolean;
};

export default React.memo(function UserMessage({
  message,
  readOnly = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-end self-end w-3/4 space-y-1">
      <div
        className="flex flex-col gap-6 px-4 bg-popover py-4 whitespace-pre-wrap border rounded-xl"
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
              size="icon"
              variant="ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(message);
                toast.success("Copied to clipboard");
              }}
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
