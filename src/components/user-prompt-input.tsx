import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import type { ChatStatus } from "ai";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useRef, useState } from "react";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import type { ChatHookType } from "~/types";
import AutoResizeTextarea from "./auto-resize-textarea";
import PromptActions from "./prompt-actions";

type Props = {
  chatId: string;
  status: ChatStatus;
  stop: ChatHookType["stop"];
  sendMessage: ChatHookType["sendMessage"];
};

export default function UserPromptInput(props: Props) {
  const { chatId: paramsChatId } = useParams({ strict: false });
  const { auth } = useRouteContext({ from: "/_auth" });

  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaValue, setTextareaValue] = useState("");
  const selectedModel = useModelStore((store) => store.selectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
  const persistedApiKeys = usePersistedApiKeysStore(
    (store) => store.persistedApiKeys
  );
  const persistedUseOpenRouter = usePersistedApiKeysStore(
    (store) => store.persistedUseOpenRouter
  );

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
    const title = await getChatTitle({ data: { userMessage: textareaValue } });
    await updateChatTitleMutation.mutateAsync({
      chat: { chatId: dbGeneratedChatId, title: title as string },
      sessionToken: auth.session.token,
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
        sessionToken: auth.session.token,
        uuid: props.chatId,
      });
      handleChatTitleUpdate(dbGeneratedChatId);
    }

    createMessageMutation.mutate({
      messageBody: {
        chatId: props.chatId,
        role: "user",
        annotations: JSON.stringify([]),
        parts: JSON.stringify([{ type: "text", text: textareaValue }]),
      },
      sessionToken: auth.session.token,
    });

    props.sendMessage(
      { text: textareaValue },
      {
        body: {
          model: selectedModel,
          isWebSearchEnabled,
          apiKeys: persistedApiKeys,
          useOpenRouter: persistedUseOpenRouter,
        },
      }
    );

    setTextareaValue("");
  };

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
          <AutoResizeTextarea
            handlePromptSubmit={handlePromptSubmit}
            isPending={
              createChatMutation.isPending || createMessageMutation.isPending
            }
            setTextareaValue={setTextareaValue}
            textareaRef={textareaRef}
            textareaValue={textareaValue}
          />
        </div>

        <PromptActions status={props.status} stop={props.stop} />
      </form>
    </div>
  );
}
