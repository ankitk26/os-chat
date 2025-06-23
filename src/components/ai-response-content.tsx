import { UIMessage } from "ai";
import MemoizedMarkdown from "./memoized-markdown";

export default function AIResponseContent({ message }: { message: UIMessage }) {
  return (
    <div className="w-full max-w-full leading-8 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
      <MemoizedMarkdown content={message.content} id={message.id} />
    </div>
  );
}
