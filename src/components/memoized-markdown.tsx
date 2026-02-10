import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import CodeHighlight from "./code-highlight";

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
	({ content }: { content: string }) => (
		<ReactMarkdown
			components={{
				code: CodeHighlight,
			}}
			rehypePlugins={[rehypeKatex]}
			remarkPlugins={[remarkGfm, remarkMath]}
		>
			{content}
		</ReactMarkdown>
	),
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) {
			return false;
		}
		return true;
	},
);

type Props = {
	content: string;
	id: string;
};

export default memo(function MemoizedMarkdown({ content, id }: Props) {
	const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

	return blocks.map((block, index) => {
		const key = `${id}-block_${index}`;
		return <MemoizedMarkdownBlock content={block} key={key} />;
	});
});
