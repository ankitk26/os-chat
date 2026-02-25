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

	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;

	const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;
	const codeContent = String(children);

	if (isInline) {
		return (
			<code className="not-prose bg-secondary my-10 rounded px-2 py-1 text-sm">
				{children}
			</code>
		);
	}

	return (
		<div className="w-full max-w-full">
			<div className="bg-card-foreground/10 text-secondary-foreground dark:bg-secondary flex items-center justify-between rounded-tl-lg rounded-tr-lg px-4 text-sm">
				<span className="font-mono font-light">{language ?? "txt"}</span>
				<div className="my-0.5 flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									className="dark:hover:bg-background/20"
									onClick={async () => {
										await navigator.clipboard.writeText(codeContent);
										toast.success("Copied to clipboard");
									}}
									size="icon"
									variant="ghost"
								/>
							}
						>
							<CopyIcon />
						</TooltipTrigger>
						<TooltipContent>Copy to clipboard</TooltipContent>
					</Tooltip>
				</div>
			</div>

			<div className="bg-background dark:bg-code-dark w-full max-w-full overflow-x-auto rounded-br-lg rounded-bl-lg border-r border-b border-l text-xs sm:text-sm dark:border-0">
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
