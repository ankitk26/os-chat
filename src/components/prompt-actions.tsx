import type { ChatStatus } from "ai";
import { GlobeIcon, SendIcon, SquareIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import ModelSelector from "./model-selector";
import { Button } from "./ui/button";

type Props = {
	status: ChatStatus;
	stop: () => void;
};

export default function PromptActions({ status, stop }: Props) {
	const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
	const toggleIsWebSearch = useModelStore((store) => store.toggleIsWebSearch);
	const selectedModel = useModelStore((store) => store.selectedModel);
	const persistedUseOpenRouter = usePersistedApiKeysStore(
		(store) => store.persistedUseOpenRouter,
	);

	return (
		<div className="mt-4 flex items-center justify-between">
			<div className="flex items-center gap-2">
				<ModelSelector />

				{(selectedModel.openRouterModelId.startsWith("google") ||
					persistedUseOpenRouter) && (
					<Button
						className={cn(
							"transition-all duration-300 ease-out",
							isWebSearchEnabled ? "border-primary" : "border-border",
						)}
						onClick={toggleIsWebSearch}
						type="button"
						variant={isWebSearchEnabled ? "default" : "outline"}
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
				<Button onClick={stop} size="icon" type="button">
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
