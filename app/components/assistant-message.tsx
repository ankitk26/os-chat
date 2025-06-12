import { ChatRequestOptions } from "ai";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { toast } from "sonner";
import { modelProviders } from "~/constants/model-providers";
import { cn } from "~/lib/utils";
import CodeHighlight from "./code-highlight";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
      <div className="leading-6 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
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
          <TooltipTrigger>
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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <RefreshCcwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retry message</TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Gemini</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {modelProviders.map((model) => (
                    <DropdownMenuItem
                      key={model.modelId}
                      onClick={() => {
                        reload({ body: { model: model.modelId } });
                      }}
                    >
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
});
