import { CopyIcon, Edit2Icon, RefreshCcwIcon } from "lucide-react";
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
    <div className="flex flex-col items-end space-y-1">
      <div
        className="flex flex-col gap-6 px-4 py-4 whitespace-pre-wrap border bg-card rounded-xl"
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
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="ghost">
              <RefreshCcwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Retry message</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="ghost">
              <Edit2Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit message</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
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
