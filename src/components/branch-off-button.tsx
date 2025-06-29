import { KeyIcon, RefreshCcwIcon, SplitIcon } from "lucide-react";
import { getAccessibleModels } from "~/lib/get-accessible-models";
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

export default function BranchOffButton() {
  // const selectedModel = useModelStore((store) => store.selectedModel);

  const apiKeys = localStorage.getItem("apiKeys");
  const useOpenRouter = localStorage.getItem("useOpenRouter");
  const accessibleModels = getAccessibleModels(apiKeys, useOpenRouter);

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
            //
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
                      // await handleRetry(model);
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
