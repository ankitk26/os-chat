import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: string;
};

export default React.memo(function UserMessage({ message }: Props) {
  return (
    <div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
      <div className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4">
        {message}
      </div>
      <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
