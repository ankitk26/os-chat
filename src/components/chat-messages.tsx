import type { UIMessage } from "ai";
import { memo } from "react";
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
    <>
      {messages.map((message) => (
        <div className="flex flex-col" key={message.id}>
          {message.role === "user" ? (
            <UserMessage message={message.content} />
          ) : (
            <AssistantMessage
              message={message}
              messages={messages}
              reload={reload}
              setMessages={setMessages}
            />
          )}
        </div>
      ))}
    </>
  );
});
