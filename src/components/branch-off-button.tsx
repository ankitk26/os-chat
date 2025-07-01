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
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import { Model } from "~/types";
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

export default function BranchOffButton({ messageId }: { messageId: string }) {
  const { chatId } = useParams({ from: "/_auth/chat/$chatId" });
  const { auth } = useRouteContext({ from: "/_auth" });
  const navigate = useNavigate();

  const setSelectedModel = useModelStore((store) => store.setSelectedModel);

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

  const handleBranchOff = async (model: Model | null = null) => {
    const branchChatUuid = generateRandomUUID();

    navigate({ to: `/chat/${branchChatUuid}` });

    branchOffChatMutation.mutate({
      branchedChatUuid: branchChatUuid,
      lastMessageId: messageId,
      parentChatUuid: chatId,
      sessionToken: auth.session.token,
    });

    if (model) {
      setSelectedModel(model);
    }
  };

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
          className="flex items-center text-xs gap-3"
          onClick={async () => {
            handleBranchOff();
          }}
        >
          <RefreshCcwIcon className="size-4" />
          Branch off
        </DropdownMenuItem>

        <DropdownMenuSeparatorWithText>
          or switch model
        </DropdownMenuSeparatorWithText>

        {accessibleModels.map((provider) => (
          <DropdownMenuSub key={provider.key}>
            <DropdownMenuSubTrigger className="py-3 flex items-center text-xs gap-3">
              <ModelProviderIcon provider={provider.key} />
              {provider.provider}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="ml-2">
                {provider.models.map((model) => (
                  <DropdownMenuItem
                    className="py-3 text-xs"
                    key={model.modelId}
                    disabled={!model.isAvailable}
                    onClick={async () => {
                      handleBranchOff(model);
                    }}
                  >
                    {model.name}
                    {!model.isAvailable && (
                      <KeyIcon className="size-3 ml-auto" />
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
