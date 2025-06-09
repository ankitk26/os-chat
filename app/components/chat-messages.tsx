import { UIMessage } from "ai";
import { memo } from "react"; // Import memo
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";

type Props = {
  messages: UIMessage[];
};

const ChatMessages = memo(function ChatMessages({ messages }: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="my-8 space-y-16">
      {messages.map((message) => (
        <div key={message.id} className="space-y-8">
          <div>
            {message.role === "user" ? (
              <UserMessage message={message.content} />
            ) : (
              <AssistantMessage message={message.content} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChatMessages;
