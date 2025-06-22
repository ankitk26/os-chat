import { ChatRequestOptions, Message, UIMessage } from "ai";
import { ChevronDownIcon, ChevronRightIcon, CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import MemoizedMarkdown from "./memoized-markdown";
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
  const [showReasoning, setShowReasoning] = useState(false);

  const modelUsed =
    message.annotations &&
    message.annotations.length > 0 &&
    message.annotations.find((a) => (a as any)["type"] === "model");

  return (
    <>
      {message.parts.map((part) => {
        if (part.type === "text") {
          return (
            <>
              <div className="w-full max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
                <MemoizedMarkdown content={message.content} id={message.id} />
              </div>

              <div className="flex items-center gap-1.5 mt-1.5 transition-opacity duration-200">
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
            </>
          );
        }
        if (part.type === "reasoning") {
          return (
            <div className="space-y-2 mb-12">
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
                <div className="flex text-sm items-center space-x-2 text-muted-foreground">
                  {message.content ? (
                    <div>Reasoning</div>
                  ) : (
                    <div className="animate-pulse">Reasoning...</div>
                  )}
                </div>
              </div>

              {showReasoning && (
                <div className="w-full mt-3 max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0 bg-popover border p-4 rounded-md text-sm">
                  <MemoizedMarkdown
                    id={message.id}
                    content={part.details
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
      })}
    </>
  );
});
