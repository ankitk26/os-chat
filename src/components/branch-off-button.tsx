import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { KeyIcon, RefreshCcwIcon, SplitIcon } from "lucide-react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getAccessibleModels } from "~/lib/get-accessible-models";
import { useSharedChatContext } from "~/providers/chat-provider";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import type { CustomUIMessage, Model } from "~/types";
import ModelProviderIcon from "./model-provider-icon";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparatorWithText,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  message: CustomUIMessage;
  sendMessage?: UseChatHelpers<CustomUIMessage>["sendMessage"];
};

export default function BranchOffButton({ message, sendMessage }: Props) {
  const { chatId } = useParams({ strict: false });
  const { auth } = useRouteContext({ from: "/_auth" });
  const { clearChat } = useSharedChatContext();
  const navigate = useNavigate();

  const selectedModel = useModelStore((store) => store.selectedModel);
  const setSelectedModel = useModelStore((store) => store.setSelectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const persistedApiKeys = usePersistedApiKeysStore(
    (store) => store.persistedApiKeys
  );
  const persistedUseOpenRouter = usePersistedApiKeysStore(
    (store) => store.persistedUseOpenRouter
  );
  const accessibleModels = getAccessibleModels(
    persistedApiKeys,
    persistedUseOpenRouter
  );

  const branchOffChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.branchOffChat),
  });
  const createMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });

  const handleBranchOff = (model: Model | null = null) => {
    if (!chatId) {
      return;
    }
    const branchChatUuid = generateRandomUUID();

    clearChat();
    navigate({ to: "/chat/$chatId", params: { chatId: branchChatUuid } });

    branchOffChatMutation.mutate({
      branchedChatUuid: branchChatUuid,
      lastMessage: {
        id: message.id,
        role: message.role,
      },
      parentChatUuid: chatId,
      sessionToken: auth.session.token,
    });

    if (model) {
      setSelectedModel(model);
    }

    if (message.role === "user" && sendMessage) {
      const sourceMessageId = generateRandomUUID();

      createMessageMutation.mutate({
        messageBody: {
          chatId: branchChatUuid,
          role: "user",
          sourceMessageId,
          parts: JSON.stringify(message.parts),
        },
        sessionToken: auth.session.token,
      });

      sendMessage(
        {
          role: "user",
          id: sourceMessageId,
          parts: message.parts,
        },
        {
          body: {
            model,
            isWebSearchEnabled,
            apiKeys: persistedApiKeys,
            useOpenRouter: persistedUseOpenRouter,
            chatId: branchChatUuid,
          },
        }
      );
    }
  };

  if (!chatId) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <SplitIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Branch off</TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuItem
          className="flex items-center gap-3 text-xs"
          onClick={() => handleBranchOff(selectedModel)}
        >
          <RefreshCcwIcon className="size-4" />
          Branch off
        </DropdownMenuItem>

        <DropdownMenuSeparatorWithText>
          or switch model
        </DropdownMenuSeparatorWithText>

        {accessibleModels.map((provider) => (
          <DropdownMenuSub key={provider.key}>
            <DropdownMenuSubTrigger className="flex items-center gap-3 py-3 text-xs">
              <ModelProviderIcon provider={provider.key} />
              {provider.provider}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="ml-2 w-[200px]">
                {provider.models.map((model) => (
                  <DropdownMenuItem
                    className="py-3 text-xs"
                    disabled={!model.isAvailable}
                    key={model.modelId}
                    onClick={() => handleBranchOff(model)}
                  >
                    <ModelProviderIcon provider={provider.key} />
                    {model.name}
                    {!model.isAvailable && (
                      <KeyIcon className="ml-auto size-3" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
