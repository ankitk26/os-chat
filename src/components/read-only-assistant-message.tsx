import { JSONValue } from "ai";
import { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import MemoizedMarkdown from "./memoized-markdown";
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
    annotations.find((a) => (a as any)["type"] === "model");

  return (
    <>
      <div className="w-full max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
        <MemoizedMarkdown content={message.content} id={message._id} />
      </div>

      <div className="flex items-center transition-opacity duration-200">
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

        <span className="text-muted-foreground text-xs">
          {(modelUsed as any)?.data}
        </span>
      </div>
    </>
  );
}
