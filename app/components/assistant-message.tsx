import { ChatRequestOptions } from "ai";
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
  message: string;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default React.memo(function AssistantMessage({
  message,
  reload,
}: Props) {
  return (
    <>
      <div className="w-full max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          children={message}
          components={{
            code: CodeHighlight,
          }}
        />
      </div>

      <div className={cn("flex transition-opacity duration-200")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(message);
                toast.success("Copied to clipboard");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>

        <RetryModelDropdown reload={reload} />
      </div>
    </>
  );
});
