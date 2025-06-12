import { ChatRequestOptions } from "ai";
import { RefreshCcwIcon } from "lucide-react";
import { modelProviders } from "~/constants/model-providers";
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
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default function RetryModelDropdown({ reload }: Props) {
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
                  onClick={() => {
                    reload({ body: { model: model.modelId } });
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
