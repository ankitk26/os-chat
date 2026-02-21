import MemoizedMarkdown from "./memoized-markdown";

type Props = {
	messageId: string;
	reasoningContent: string;
};

export default function ReasoningMarkdown(props: Props) {
	return (
		<div className="prose prose-neutral dark:prose-invert prose-rose prose-pre:m-0 bg-popover prose-pre:bg-transparent prose-pre:p-0 w-full max-w-full rounded-md border p-4 font-mono text-xs leading-6">
			<MemoizedMarkdown content={props.reasoningContent} id={props.messageId} />
		</div>
	);
}
