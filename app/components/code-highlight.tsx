import { CopyIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactNode } from "react";
import ShikiHighlighter, { isInlineCode, type Element } from "react-shiki";
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

  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;
  const codeContent = String(children);

  if (isInline) {
    return (
      <code className="px-2 py-1 my-10 text-sm rounded bg-secondary not-prose">
        {children}
      </code>
    );
  }

  return (
    <div className="border rounded-lg dark:border-none">
      <div className="flex items-center justify-between px-4 text-sm rounded-tl-lg rounded-tr-lg text-secondary-foreground bg-card-foreground/10 dark:bg-secondary">
        <span className="font-mono font-light">{language}</span>
        <div className="flex items-center gap-2 my-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="dark:hover:bg-background/20"
                variant="ghost"
                onClick={async () => {
                  await navigator.clipboard.writeText(codeContent);
                  toast.success("Copied to clipboard");
                }}
              >
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <ShikiHighlighter
          language={language}
          theme={theme === "light" ? "github-light" : "poimandres"}
          showLanguage={false}
          className="font-mono text-sm"
        >
          {codeContent}
        </ShikiHighlighter>
      </div>
    </div>
  );
}
