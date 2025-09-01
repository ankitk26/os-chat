import type { UseChatHelpers } from "@ai-sdk/react";
import { CopyIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import type { CustomUIMessage } from "~/types";
import BranchOffButton from "./branch-off-button";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: CustomUIMessage;
  sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
};

export default memo(function UserMessage({ message, sendMessage }: Props) {
  const messageContent = getMessageContentFromParts(message.parts);

  return (
    <div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
      <div className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4 text-sm">
        {messageContent}
      </div>
      <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <BranchOffButton message={message} sendMessage={sendMessage} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(messageContent);
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
