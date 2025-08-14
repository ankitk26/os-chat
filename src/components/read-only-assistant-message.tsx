import type { JSONValue, UIMessage } from "ai";
import type { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import AIResponseContent from "./ai-response-content";
import AIResponseReasoning from "./ai-response-reasoning";
import AIResponseSources from "./ai-response-sources";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: Doc<"messages">;
};

export default function ReadOnlyAssistantMessage({ message }: Props) {
  const annotations: JSONValue[] = JSON.parse(message.annotations);

  const modelUsed =
    annotations &&
    annotations.length > 0 &&
    // biome-ignore lint/complexity/useLiteralKeys: To be fixed later
    // biome-ignore lint/suspicious/noExplicitAny: To be fixed later
    annotations.find((a) => (a as any)["type"] === "model");

  const messageContent = getMessageContentFromParts(JSON.parse(message.parts));
  const messageId = message.sourceMessageId ?? message._id;
  const messageParts = JSON.parse(message.parts) as UIMessage["parts"];

  return (
    <div className="space-y-4">
      <AIResponseReasoning
        messageContent={messageContent}
        messageId={messageId}
        parts={messageParts}
      />
      <AIResponseContent
        messageContent={messageContent}
        messageId={messageId}
      />
      <AIResponseSources parts={messageParts} />
      <div className="flex items-center gap-1.5 transition-opacity duration-200">
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

        <span className="text-muted-foreground text-xs">
          {/* biome-ignore lint/suspicious/noExplicitAny: To be fixed later */}
          {(modelUsed as any)?.data}
        </span>
      </div>
    </div>
  );
}
