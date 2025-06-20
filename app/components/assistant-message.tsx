import { ChatRequestOptions, Message, UIMessage } from "ai";
import { CopyIcon } from "lucide-react";
import React from "react";
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

  const modelUsed =
    message.annotations &&
    message.annotations.length > 0 &&
    (message as any).annotations[0].model;

  if (!message.content) {
    return null;
  }

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

        <span className="text-muted-foreground text-xs">{modelUsed}</span>
      </div>
    </>
  );
});
