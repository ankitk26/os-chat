import type { UseChatHelpers } from "@ai-sdk/react";
import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import type { CustomUIMessage } from "~/types";
import AIResponseContent from "./ai-response-content";
import AIResponseReasoning from "./ai-response-reasoning";
import AIResponseSources from "./ai-response-sources";
import BranchOffButton from "./branch-off-button";
import RetryModelDropdown from "./retry-model-dropdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: CustomUIMessage;
  regenerate?: UseChatHelpers<CustomUIMessage>["regenerate"];
  setMessages: UseChatHelpers<CustomUIMessage>["setMessages"];
  messages: CustomUIMessage[];
};

export default React.memo(function AssistantMessage(props: Props) {
  const { message, regenerate, setMessages, messages } = props;

  // const modelUsed =
  // 	message.annotations &&
  // 	message.annotations.length > 0 &&
  // 	// biome-ignore lint/complexity/useLiteralKeys: To be fixed later
  // 	// biome-ignore lint/suspicious/noExplicitAny: To be fixed later
  // 	message.annotations.find((a) => (a as any)["type"] === "model");
  const modelUsed = "placeholder";

  const messageContent = getMessageContentFromParts(message.parts);

  return (
    <div className="group space-y-3 lg:space-y-4">
      <AIResponseReasoning
        messageContent={messageContent}
        messageId={message.id}
        parts={message.parts}
      />
      <AIResponseContent
        messageContent={messageContent}
        messageId={message.id}
      />
      <AIResponseSources parts={message.parts} />

      {/* Message actions */}
      <div className="flex items-center gap-1 transition-opacity duration-200 group-has-[data-state=open]:bg-red-600 md:opacity-0 group-hover:md:opacity-100 lg:gap-1.5">
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

        <BranchOffButton messageId={message.id} />

        {regenerate && (
          <RetryModelDropdown
            message={message}
            messages={messages}
            regenerate={regenerate}
            setMessages={setMessages}
          />
        )}

        <span className="text-muted-foreground text-xs">
          {/** biome-ignore lint/suspicious/noExplicitAny: To be fixed later */}
          {(modelUsed as any)?.data}
        </span>
      </div>
    </div>
  );
});
