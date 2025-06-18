import { ChatRequestOptions, UIMessage } from "ai";
import { CopyIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import CodeHighlight from "./code-highlight";
import RetryModelDropdown from "./retry-model-dropdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: UIMessage;
  reload?: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  readOnly?: boolean;
};

export default React.memo(function AssistantMessage(props: Props) {
  const { message, reload, readOnly } = props;

  const modelUsed =
    message.annotations &&
    message.annotations.length > 0 &&
    (message as any).annotations[0].model;

  return (
    <>
      <div className="w-full max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          children={message.content}
          components={{
            code: CodeHighlight,
          }}
        />
      </div>

      <div className={cn("flex items-center transition-opacity duration-200")}>
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

        {reload && !readOnly && (
          <RetryModelDropdown message={message} reload={reload} />
        )}

        <span className="text-muted-foreground text-xs">{modelUsed}</span>
      </div>
    </>
  );
});
