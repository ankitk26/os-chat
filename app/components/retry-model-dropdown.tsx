import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatRequestOptions, UIMessage } from "ai";
import { api } from "convex/_generated/api";
import { RefreshCcwIcon } from "lucide-react";
import { openRouterModelProviders } from "~/constants/model-providers";
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
};

export default function RetryModelDropdown({ message, reload }: Props) {
  const { data: authData } = useQuery(authQueryOptions);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const deleteMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessage),
  });

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
        {openRouterModelProviders.map((provider) => (
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
                    disabled={!model.isFree}
                    onClick={async () => {
                      await deleteMessageMutation.mutateAsync({
                        sessionToken: authData?.session.token ?? "",
                        sourceMessageId: message.id,
                      });
                      await reload({
                        body: {
                          model: model.modelId,
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
