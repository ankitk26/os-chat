import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatRequestOptions, UIMessage } from "ai";
import { api } from "convex/_generated/api";
import { RefreshCcwIcon } from "lucide-react";
import { modelProviders } from "~/constants/model-providers";
import { authQueryOptions } from "~/queries/auth";
import { useModelStore } from "~/stores/model-store";
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
  const setRetryModel = useModelStore((store) => store.setRetryModel);
  const retryModel = useModelStore((store) => store.retryModel);

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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="py-3">
            Gemini
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {modelProviders.map((model) => (
                <DropdownMenuItem
                  className="py-3"
                  key={model.modelId}
                  onClick={async () => {
                    await deleteMessageMutation.mutateAsync({
                      sessionToken: authData?.session.token ?? "",
                      sourceMessageId: message.id,
                    });
                    await reload({
                      body: { model: model.modelId, isWebSearchEnabled },
                    });
                  }}
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
