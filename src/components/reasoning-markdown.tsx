import MemoizedMarkdown from "./memoized-markdown";

type Props = {
  messageId: string;
  reasoningContent: string;
};

export default function ReasoningMarkdown(props: Props) {
  return (
    <div className="w-full mt-3 max-w-full leading-6 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0 bg-popover border p-4 rounded-md text-sm font-mono">
      <MemoizedMarkdown id={props.messageId} content={props.reasoningContent} />
    </div>
  );
}
