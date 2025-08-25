import { UseChatHelpers } from "@ai-sdk/react";
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
import { Dispatch, memo, SetStateAction, useEffect, useRef } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import type { CustomUIMessage } from "~/types";
import PromptActions from "./prompt-actions";

type Props = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  chatId: string;
  status: ChatStatus;
  stop: UseChatHelpers<CustomUIMessage>["stop"];
  sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
};

function PureUserPromptInput(props: Props) {
  const { chatId: paramsChatId } = useParams({ strict: false });
  const { auth } = useRouteContext({ from: "/_auth" });

  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    const title = await getChatTitle({ data: { userMessage: props.input } });
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
        replace: true,
      });
      const dbGeneratedChatId = await createChatMutation.mutateAsync({
        sessionToken: auth.session.token,
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
        annotations: JSON.stringify([]),
        parts: JSON.stringify([{ type: "text", text: props.input }]),
      },
      sessionToken: auth.session.token,
    });

    console.log(`sending message - ${props.input}`);
    props.sendMessage(
      {
        role: "user",
        id: sourceMessageId,
        parts: [{ type: "text", text: props.input }],
      },
      {
        body: {
          model: selectedModel,
          isWebSearchEnabled,
          apiKeys: persistedApiKeys,
          useOpenRouter: persistedUseOpenRouter,
        },
      }
    );

    props.setInput("");
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
  }, [props.input]);

  // Focus the textarea when the chat ID changes or on initial load.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [props.chatId]);

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
              props.setInput(e.target.value);
              resizeTextarea();
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
            value={props.input}
          />
        </div>

        <PromptActions status={props.status} stop={props.stop} />
      </form>
    </div>
  );
}

const UserPromptInput = memo(PureUserPromptInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  return true;
});

export default UserPromptInput;
