import { UIMessage } from "ai";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import MemoizedMarkdown from "./memoized-markdown";
import { Button } from "./ui/button";

export default function AIResponseReasoning({
  message,
}: {
  message: UIMessage;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const reasoningPart = message.parts.find((part) => part.type === "reasoning");

  if (!reasoningPart) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="space-x-2 flex items-center">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setShowReasoning((prev) => !prev);
          }}
          className="cursor-pointer size-5 rounded"
        >
          {showReasoning ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </Button>

        <div className="text-sm font-mono text-muted-foreground">
          {message.content ? (
            <div>Reasoning</div>
          ) : (
            <div className="animate-pulse">Reasoning...</div>
          )}
        </div>
      </div>

      {showReasoning && (
        <div className="w-full mt-3 max-w-full leading-6 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0 bg-popover border p-4 rounded-md text-sm font-mono">
          <MemoizedMarkdown
            id={message.id}
            content={reasoningPart.details
              .map((detail) =>
                detail.type === "text" ? detail.text : "redacted"
              )
              .toString()}
          />
        </div>
      )}
    </div>
  );
}
