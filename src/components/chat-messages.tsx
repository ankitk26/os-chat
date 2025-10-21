import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import type { CustomUIMessage } from "~/types";
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";

type Props = {
  messages: CustomUIMessage[];
  regenerate: UseChatHelpers<CustomUIMessage>["regenerate"];
  sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
};

export default memo(function ChatMessages({
  messages,
  regenerate,
  sendMessage,
}: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 px-3 lg:space-y-2 lg:px-0">
      {messages.map((message) => (
        <div className="flex flex-col" key={message.id}>
          {message.role === "user" ? (
            <UserMessage
              message={message}
              regenerate={regenerate}
              sendMessage={sendMessage}
            />
          ) : (
            <AssistantMessage message={message} regenerate={regenerate} />
          )}
        </div>
      ))}
    </div>
  );
});
