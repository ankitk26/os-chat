import { ChevronDownIcon } from "lucide-react";
import { openRouterModelProviders } from "~/constants/model-providers";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          {selectedModel.name}
          <ChevronDownIcon />
        </Button>
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
                    onClick={() => {
                      setSelectedModel({ id: model.modelId, name: model.name });
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
