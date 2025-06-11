import { useChat } from "@ai-sdk/react";
import { useRef } from "react";
import ChatLoadingIndicator from "./chat-loading-indicator";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
import { ScrollArea } from "./ui/scroll-area";
import UserPromptInput from "./user-prompt-input";

export default function Chat() {
  const { messages, input, status, handleSubmit, setInput, stop, reload } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <div className="flex flex-col max-h-svh h-[calc(100svh-17px)] w-full mx-auto">
      <div className="flex-1 overflow-hidden">
        <EmptyChatContent messages={messages} />

        <ScrollArea className="w-full h-full">
          <div className="w-full h-full max-w-3xl mx-auto">
            <ChatMessages messages={messages} reload={reload} />
            <ChatLoadingIndicator status={status} />
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="backdrop-blur">
        <UserPromptInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          stop={stop}
          status={status}
        />
      </div>
    </div>
  );
}
