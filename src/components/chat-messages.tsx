import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import type { CustomUIMessage } from "~/types";
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";

type Props = {
  messages: CustomUIMessage[];
  regenerate: UseChatHelpers<CustomUIMessage>["regenerate"];
  setMessages: UseChatHelpers<CustomUIMessage>["setMessages"];
};

export default memo(function ChatMessages(props: Props) {
  const { messages, regenerate, setMessages } = props;

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 px-3 lg:space-y-2 lg:px-0">
      {messages.map((message) => {
        const messageContent = getMessageContentFromParts(message.parts);
        return (
          <div className="flex flex-col" key={message.id}>
            {message.role === "user" ? (
              <UserMessage message={messageContent} />
            ) : (
              <AssistantMessage
                message={message}
                messages={messages}
                regenerate={regenerate}
                setMessages={setMessages}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
