import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { ChatStatus } from "ai";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import { useTextSelectionStore } from "~/stores/text-selection-store";
import type { CustomUIMessage } from "~/types";
import PromptActions from "./prompt-actions";

type Props = {
  chatId: string;
  status: ChatStatus;
  stop: UseChatHelpers<CustomUIMessage>["stop"];
  sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
};

export default function UserPromptInput(props: Props) {
  const { chatId: paramsChatId } = useParams({ strict: false });

  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedModel = useModelStore((store) => store.selectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
  const persistedApiKeys = usePersistedApiKeysStore(
    (store) => store.persistedApiKeys,
  );
  const persistedUseOpenRouter = usePersistedApiKeysStore(
    (store) => store.persistedUseOpenRouter,
  );
  const { selectedText, clearSelectedText } = useTextSelectionStore();

  const updateChatTitleMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.updateChatTitle),
  });
  const createMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });
  const createChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createChat),
  });

  const handleChatTitleUpdate = async (dbGeneratedChatId: Id<"chats">) => {
    const title = await getChatTitle({ data: { userMessage: input } });
    await updateChatTitleMutation.mutateAsync({
      chat: { chatId: dbGeneratedChatId, title: title as string },
    });
  };

  const handlePromptSubmit = async () => {
    if (!textareaRef.current?.value) {
      return;
    }

    if (!paramsChatId) {
      navigate({
        to: "/chat/$chatId",
        params: { chatId: props.chatId },
      });
      const dbGeneratedChatId = await createChatMutation.mutateAsync({
        uuid: props.chatId,
      });
      handleChatTitleUpdate(dbGeneratedChatId);
    }

    const sourceMessageId = generateRandomUUID();

    createMessageMutation.mutate({
      messageBody: {
        chatId: props.chatId,
        role: "user",
        sourceMessageId,
        parts: JSON.stringify([{ type: "text", text: input }]),
      },
    });

    props.sendMessage(
      {
        role: "user",
        id: sourceMessageId,
        parts: [{ type: "text", text: input }],
      },
      {
        body: {
          model: selectedModel,
          isWebSearchEnabled,
          apiKeys: persistedApiKeys,
          useOpenRouter: persistedUseOpenRouter,
          chatId: props.chatId,
        },
      },
    );

    setInput("");
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Resize when the textarea value changes.
  useEffect(() => {
    resizeTextarea();
  }, [input]);

  // Focus the textarea when the chat ID changes or on initial load.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [props.chatId]);

  // Populate input when selected text changes
  useEffect(() => {
    if (selectedText) {
      setInput(selectedText);
      clearSelectedText();
      // Focus the textarea after setting the text
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Move cursor to end of text
        textareaRef.current.setSelectionRange(
          selectedText.length,
          selectedText.length,
        );
      }
    }
  }, [selectedText, clearSelectedText]);

  return (
    <div className="bg-background/80 backdrop-blur">
      <form
        className="mx-auto flex min-h-30 w-full max-w-3xl flex-col rounded-tl-lg rounded-tr-lg border border-border bg-popover/90 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handlePromptSubmit();
        }}
      >
        <div className="flex-1">
          <textarea
            className="max-h-80 min-h-8 w-full resize-none text-sm focus:outline-none"
            disabled={
              createChatMutation.isPending || createMessageMutation.isPending
            }
            onChange={(e) => {
              setInput(e.target.value);
              // resizeTextarea();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePromptSubmit();
              }
            }}
            placeholder="Start the conversation..."
            ref={textareaRef}
            rows={1}
            value={input}
          />
        </div>

        <PromptActions status={props.status} stop={props.stop} />
      </form>
    </div>
  );
}
