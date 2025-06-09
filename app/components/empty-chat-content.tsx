import { UIMessage } from "ai";

interface Props {
  messages: UIMessage[];
}

export default function EmptyChatContent({ messages }: Props) {
  if (messages.length !== 0) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center w-full h-full max-w-3xl mx-auto">
      <h2 className="mb-2 text-3xl font-semibold">Welcome Ankit</h2>
      <p>Start a conversation by typing a message below.</p>
    </div>
  );
}
