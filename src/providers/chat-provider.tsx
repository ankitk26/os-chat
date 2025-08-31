import { Chat } from "@ai-sdk/react";
import { useParams } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CustomUIMessage } from "~/types";

type ChatContextValue = {
  // replace with your custom message type
  chat: Chat<CustomUIMessage>;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat() {
  return new Chat<CustomUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { chatId } = useParams({ strict: false });
  const [chat, setChat] = useState(() => createChat());

  const clearChat = () => {
    setChat(createChat());
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when chatId updates
  useEffect(() => {
    clearChat();
  }, [chatId]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChatContext must be used within a ChatProvider");
  }
  return context;
}
