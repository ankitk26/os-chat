import { UIMessage } from "ai";

interface Props {
  messages: UIMessage[];
}

export default function EmptyChatContent({ messages }: Props) {
  if (messages.length !== 0) {
    return null;
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-2">Welcome to os.chat</h2>
      <p>Start a conversation by typing a message below.</p>
    </div>
  );
}
