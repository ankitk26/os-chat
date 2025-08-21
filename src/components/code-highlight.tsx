import { CopyIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import ShikiHighlighter, { type Element, isInlineCode } from "react-shiki";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type CodeHighlightProps = {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
};

export default function CodeHighlight({
  className,
  children,
  node,
}: CodeHighlightProps) {
  const { theme } = useTheme();

  // biome-ignore lint/performance/useTopLevelRegex: Ignore
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;
  const codeContent = String(children);

  if (isInline) {
    return (
      <code className="not-prose my-10 rounded bg-secondary px-2 py-1 text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between rounded-tl-lg rounded-tr-lg bg-card-foreground/10 px-4 text-secondary-foreground text-sm dark:bg-secondary">
        <span className="font-light font-mono">{language ?? "txt"}</span>
        <div className="my-0.5 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="dark:hover:bg-background/20"
                onClick={async () => {
                  await navigator.clipboard.writeText(codeContent);
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
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto rounded-br-lg rounded-bl-lg border-r border-b border-l bg-background dark:border-0 dark:bg-code-dark">
        <ShikiHighlighter
          className="text-sm"
          delay={150}
          language={language}
          showLanguage={false}
          theme={theme === "light" ? "github-light" : "vesper"}
        >
          {codeContent}
        </ShikiHighlighter>
      </div>
    </div>
  );
}
