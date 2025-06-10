import { ChatRequestOptions, UIMessage } from "ai";
import { memo } from "react";
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";

type Props = {
  messages: UIMessage[];
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

const ChatMessages = memo(function ChatMessages({ messages, reload }: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="my-8 space-y-8">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? (
            <UserMessage message={message.content} />
          ) : (
            <AssistantMessage message={message.content} reload={reload} />
          )}
        </div>
      ))}
    </div>
  );
});

export default ChatMessages;
