import { useChat } from "@ai-sdk/react";
import { useRef } from "react";
import EmptyChatContent from "./empty-chat-content";
import { ScrollArea } from "./ui/scroll-area";
import UserPromptInput from "./user-prompt-input";
import ChatMessages from "./chat-messages";
import ChatLoadingIndicator from "./chat-loading-indicator";

export default function Chat() {
  const { messages, input, handleInputChange, status, handleSubmit } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-17px)] max-w-4xl w-full mx-auto">
      <div className="flex-1 overflow-hidden">
        <EmptyChatContent messages={messages} />
        <ScrollArea className="h-full">
          <ChatMessages messages={messages} />
          <ChatLoadingIndicator status={status} />
        </ScrollArea>
      </div>

      <div className="sticky bottom-0 w-full">
        <UserPromptInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
