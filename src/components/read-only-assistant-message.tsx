import type { JSONValue, UIMessage } from "ai";
import type { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
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

  const uiMessage = {
    id: message.sourceMessageId ?? message._id,
    role: message.role,
    annotations: JSON.parse(message.annotations),
    content: message.content,
    parts: JSON.parse(message.parts),
    createdAt: new Date(message._creationTime),
  } satisfies UIMessage;

  return (
    <div className="space-y-4">
      <AIResponseReasoning message={uiMessage} />
      <AIResponseContent message={uiMessage} />
      <AIResponseSources message={uiMessage} />
      <div className="flex items-center gap-1.5 transition-opacity duration-200">
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

        <span className="text-muted-foreground text-xs">
          {/* biome-ignore lint/suspicious/noExplicitAny: To be fixed later */}
          {(modelUsed as any)?.data}
        </span>
      </div>
    </div>
  );
}
