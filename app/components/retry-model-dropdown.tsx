import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatRequestOptions, Message, UIMessage } from "ai";
import { api } from "convex/_generated/api";
import { RefreshCcwIcon } from "lucide-react";
import { getAccessibleModels } from "~/lib/get-accessible-models";
import { authQueryOptions } from "~/queries/auth";
import { useModelStore } from "~/stores/model-store";
import ModelProviderIcon from "./model-provider-icon";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
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

export default function RetryModelDropdown({
  message,
  reload,
  setMessages,
  messages,
}: Props) {
  const { data: authData } = useQuery(authQueryOptions);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const deleteMessagesMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessagesByTimestamp),
  });

  const apiKeys = localStorage.getItem("apiKeys");
  const useOpenRouter = localStorage.getItem("useOpenRouter");
  const accessibleModels = getAccessibleModels(apiKeys, useOpenRouter);

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
      <DropdownMenuContent>
        {accessibleModels.map((provider) => (
          <DropdownMenuSub key={provider.key}>
            <DropdownMenuSubTrigger className="py-3 flex items-center gap-3">
              <ModelProviderIcon provider={provider.key} />
              {provider.provider}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {provider.models.map((model) => (
                  <DropdownMenuItem
                    className="py-3"
                    key={model.modelId}
                    disabled={!model.isAvailable}
                    onClick={async () => {
                      deleteMessagesMutation.mutate({
                        sessionToken: authData?.session.token ?? "",
                        currentMessageSourceId: message.id,
                      });
                      const currentMessage = messages.find(
                        (m) => m.id === message.id
                      );
                      setMessages((prev) => [
                        ...prev.filter(
                          (m) => m.createdAt! < currentMessage?.createdAt!
                        ),
                      ]);
                      await reload({
                        body: {
                          model,
                          isWebSearchEnabled,
                          apiKeys: localStorage.getItem("apiKeys"),
                          useOpenRouter: localStorage.getItem("useOpenRouter"),
                        },
                      });
                    }}
                  >
                    {model.name}
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
