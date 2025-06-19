import { ChevronDownIcon } from "lucide-react";
import { getAccessibleModels } from "~/lib/get-accessible-models";
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

export default function ModelSelector() {
  const selectedModel = useModelStore((store) => store.selectedModel);
  const setSelectedModel = useModelStore((store) => store.setSelectedModel);

  const apiKeys = localStorage.getItem("apiKeys");
  const useOpenRouter = localStorage.getItem("useOpenRouter");
  const accessibleModels = getAccessibleModels(apiKeys, useOpenRouter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedModel.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {accessibleModels.map((provider) => (
          <DropdownMenuSub key={provider.key}>
            <DropdownMenuSubTrigger className="py-3 flex items-center gap-3">
              <ModelProviderIcon provider={provider.key} />
              {provider.provider}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="ml-2">
                {provider.models.map((model) => (
                  <DropdownMenuItem
                    className="py-3"
                    key={model.modelId}
                    disabled={!model.isAvailable}
                    onClick={() => {
                      setSelectedModel(model);
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
