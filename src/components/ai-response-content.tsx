import type { UIMessage } from "ai";
import MemoizedMarkdown from "./memoized-markdown";

export default function AIResponseContent({ message }: { message: UIMessage }) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-rose prose-pre:m-0 w-full max-w-full prose-pre:bg-transparent prose-pre:p-0 text-sm leading-8">
      <MemoizedMarkdown content={message.content} id={message.id} />
    </div>
  );
}
