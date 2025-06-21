import { GlobeIcon, SendIcon, SquareIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useModelStore } from "~/stores/model-store";
import ModelSelector from "./model-selector";
import { Button } from "./ui/button";

type Props = {
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
};

export default function PromptActions({ status, stop }: Props) {
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
  const toggleIsWebSearch = useModelStore((store) => store.toggleIsWebSearch);
  const selectedModel = useModelStore((store) => store.selectedModel);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ModelSelector />

        {selectedModel.openRouterModelId.startsWith("google") && (
          <Button
            type="button"
            size="sm"
            variant={isWebSearchEnabled ? "default" : "outline"}
            className={cn("text-xs", isWebSearchEnabled ? "border" : "")}
            onClick={toggleIsWebSearch}
          >
            <GlobeIcon />
            Search
          </Button>
        )}

        {/* <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
        >
          <PaperclipIcon />
          Attach
        </Button> */}
      </div>

      {status === "streaming" || status === "submitted" ? (
        <Button size="icon" type="button" onClick={stop}>
          <SquareIcon />
        </Button>
      ) : (
        <Button size="icon" type="submit">
          <SendIcon />
        </Button>
      )}
    </div>
  );
}
