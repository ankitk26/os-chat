import MemoizedMarkdown from "./memoized-markdown";

type Props = {
  messageId: string;
  messageContent: string;
};

export default function AIResponseContent({
  messageContent,
  messageId,
}: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-rose prose-sm prose-pre:m-0 w-full max-w-full break-words prose-pre:bg-transparent prose-pre:p-0 leading-8">
      <MemoizedMarkdown content={messageContent} id={messageId} />
    </div>
  );
}
