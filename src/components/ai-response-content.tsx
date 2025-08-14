import type { UIMessage } from "ai";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import MemoizedMarkdown from "./memoized-markdown";

export default function AIResponseContent({ message }: { message: UIMessage }) {
  const messageContent = getMessageContentFromParts(message.parts);

  return (
    <div className="prose prose-neutral dark:prose-invert prose-rose prose-pre:m-0 w-full max-w-full prose-pre:bg-transparent prose-pre:p-0 leading-8">
      <MemoizedMarkdown content={messageContent} id={message.id} />
    </div>
  );
}
