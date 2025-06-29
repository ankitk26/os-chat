import { ChatRequestOptions, Message, UIMessage } from "ai";
import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import AIResponseContent from "./ai-response-content";
import AIResponseReasoning from "./ai-response-reasoning";
import AIResponseSources from "./ai-response-sources";
import BranchOffButton from "./branch-off-button";
import RetryModelDropdown from "./retry-model-dropdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: UIMessage;
  reload?: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  messages: UIMessage[];
};

export default React.memo(function AssistantMessage(props: Props) {
  const { message, reload, setMessages, messages } = props;

  const modelUsed =
    message.annotations &&
    message.annotations.length > 0 &&
    message.annotations.find((a) => (a as any)["type"] === "model");

  return (
    <div className="space-y-4">
      <AIResponseReasoning message={message} />
      <AIResponseContent message={message} />
      <AIResponseSources message={message} />
      <div className="flex items-center gap-1.5 transition-opacity duration-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(message.content);
                toast.success("Copied to clipboard");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>

        <BranchOffButton />

        {reload && (
          <RetryModelDropdown
            message={message}
            messages={messages}
            reload={reload}
            setMessages={setMessages}
          />
        )}

        <span className="text-muted-foreground text-xs">
          {(modelUsed as any)?.data}
        </span>
      </div>
    </div>
  );
});
