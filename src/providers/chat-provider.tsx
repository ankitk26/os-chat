import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createContext, type ReactNode, useContext, useState } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import type { CustomUIMessage } from "~/types";

interface ChatContextValue {
  // replace with your custom message type
  chat: Chat<CustomUIMessage>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat() {
  return new Chat<CustomUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    generateId: generateRandomUUID,
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState(() => createChat());

  const clearChat = () => {
    setChat(createChat());
  };

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
