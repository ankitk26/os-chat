import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { ChatRequestOptions, Message, UIMessage } from "ai";
import { api } from "convex/_generated/api";
import { KeyIcon, RefreshCcwIcon } from "lucide-react";
import { getAccessibleModels } from "~/lib/get-accessible-models";
import { useModelStore } from "~/stores/model-store";
import type { Model } from "~/types";
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
  message: UIMessage;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  messages: UIMessage[];
};

export default function RetryModelDropdown(props: Props) {
  const { message, reload, setMessages, messages } = props;
  const { auth } = useRouteContext({ from: "/_auth" });
  const selectedModel = useModelStore((store) => store.selectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const deleteMessagesMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessagesByTimestamp),
  });

  const apiKeys = localStorage.getItem("apiKeys");
  const useOpenRouter = localStorage.getItem("useOpenRouter");
  const accessibleModels = getAccessibleModels(apiKeys, useOpenRouter);

  const handleRetry = async (model: Model) => {
    deleteMessagesMutation.mutate({
      sessionToken: auth.session.token,
      currentMessageSourceId: message.id,
    });
    const currentMessage = messages.find((m) => m.id === message.id);
    setMessages((prev) => [
      ...prev.filter((m) => m.createdAt! < currentMessage?.createdAt!),
    ]);
    await reload({
      body: {
        model,
        isWebSearchEnabled,
        apiKeys: localStorage.getItem("apiKeys"),
        useOpenRouter: localStorage.getItem("useOpenRouter"),
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <RefreshCcwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Retry message</TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuItem
          className="flex items-center text-xs gap-3"
          onClick={async () => {
            await handleRetry(selectedModel);
          }}
        >
          <RefreshCcwIcon className="size-4" />
          Retry same
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
                      await handleRetry(model);
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
