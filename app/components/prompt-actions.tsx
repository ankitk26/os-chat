import { GlobeIcon, PaperclipIcon, SendIcon, SquareIcon } from "lucide-react";
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ModelSelector />
        <Button
          type="button"
          size="sm"
          variant={isWebSearchEnabled ? "default" : "outline"}
          className={cn("rounded-full", isWebSearchEnabled ? "border" : "")}
          onClick={toggleIsWebSearch}
        >
          <GlobeIcon />
          Search
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
        >
          <PaperclipIcon />
          Attach
        </Button>
      </div>

      {status === "streaming" || status === "submitted" ? (
        <Button size="icon" type="submit" className="size-9" onClick={stop}>
          <SquareIcon />
        </Button>
      ) : (
        <Button size="icon" type="submit" className="size-9">
          <SendIcon />
        </Button>
      )}
    </div>
  );
}
