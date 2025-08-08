import MemoizedMarkdown from "./memoized-markdown";

type Props = {
  messageId: string;
  reasoningContent: string;
};

export default function ReasoningMarkdown(props: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-rose prose-pre:m-0 mt-3 w-full max-w-full rounded-md border bg-popover prose-pre:bg-transparent p-4 prose-pre:p-0 font-mono text-sm leading-6">
      <MemoizedMarkdown content={props.reasoningContent} id={props.messageId} />
    </div>
  );
}
