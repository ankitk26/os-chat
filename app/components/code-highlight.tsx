import type { ReactNode } from "react";
import ShikiHighlighter, {
  isInlineCode,
  useShikiHighlighter,
  type Element,
} from "react-shiki";

interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export default function CodeHighlight({
  className,
  children,
  node,
  ...props
}: CodeHighlightProps) {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;

  return !isInline ? (
    <ShikiHighlighter
      language={language}
      theme="catppuccin-mocha"
      showLanguage={false}
      className="font-mono text-sm"
      {...props}
    >
      {String(children)}
    </ShikiHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
