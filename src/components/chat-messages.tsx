import type { UIMessage } from "ai";
import { memo } from "react";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import type { ChatHookType } from "~/types";
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";

type Props = {
  messages: UIMessage[];
  reload: ChatHookType["reload"];
  setMessages: ChatHookType["setMessages"];
};

export default memo(function ChatMessages(props: Props) {
  const { messages, reload, setMessages } = props;

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
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
                reload={reload}
                setMessages={setMessages}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
