import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { CopyIcon, PencilIcon, PencilOffIcon } from "lucide-react";
import { type FormEvent, memo, useState } from "react";
import { toast } from "sonner";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import type { CustomUIMessage } from "~/types";
import BranchOffButton from "./branch-off-button";
import RetryModelDropdown from "./retry-model-dropdown";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: CustomUIMessage;
  sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
  regenerate: UseChatHelpers<CustomUIMessage>["regenerate"];
};

export default memo(function UserMessage({
  message,
  sendMessage,
  regenerate,
}: Props) {
  const { auth } = useRouteContext({ from: "/_auth" });
  const { chatId } = useParams({ from: "/_auth/chat/$chatId" });
  const messageContent = getMessageContentFromParts(message.parts);

  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(messageContent);

  const selectedModel = useModelStore((store) => store.selectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
  const persistedApiKeys = usePersistedApiKeysStore(
    (store) => store.persistedApiKeys
  );
  const persistedUseOpenRouter = usePersistedApiKeysStore(
    (store) => store.persistedUseOpenRouter
  );

  const createMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });

  const deleteMessagesMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessagesByTimestamp),
  });

  const handleMessageEdit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceMessageId = generateRandomUUID();

    deleteMessagesMutation.mutate({
      sessionToken: auth.session.token,
      currentMessageSourceId: message.id,
      chatId,
      deleteCurrentMessage: true,
    });

    createMessageMutation.mutate({
      messageBody: {
        chatId,
        role: "user",
        sourceMessageId,
        parts: JSON.stringify([{ type: "text", text: input }]),
      },
      sessionToken: auth.session.token,
    });

    sendMessage(
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
          chatId,
        },
      }
    );
  };

  return (
    <div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
      {isEditing ? (
        <form onSubmit={handleMessageEdit}>
          <Input onChange={(e) => setInput(e.target.value)} value={input} />
        </form>
      ) : (
        <div className="wrap-break-word flex w-full max-w-full flex-col gap-6 whitespace-pre-wrap rounded-xl border bg-popover px-4 py-4 text-sm">
          {messageContent}
        </div>
      )}
      <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
          size="icon"
          variant="ghost"
        >
          {isEditing ? <PencilOffIcon /> : <PencilIcon />}
        </Button>
        <BranchOffButton message={message} sendMessage={sendMessage} />
        <RetryModelDropdown message={message} regenerate={regenerate} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(messageContent);
                toast.success("Copied to clipboard");
              }}
              size="icon"
              variant="ghost"
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});
