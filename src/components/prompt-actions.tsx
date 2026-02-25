import { useHotkey } from "@tanstack/react-hotkeys";
import type { ChatStatus } from "ai";
import { GlobeIcon, SendIcon, SquareIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import ModelSelector from "./model-selector";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

	useHotkey("Mod+Shift+S", toggleIsWebSearch);

	return (
		<div className="mt-3 flex flex-row items-center justify-between gap-2 lg:mt-4">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<ModelSelector />

				{(selectedModel.openRouterModelId.startsWith("google") ||
					persistedUseOpenRouter) && (
					<Tooltip>
						<TooltipTrigger
							render={
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
									<span className="hidden sm:inline">Search</span>
									<span className="sm:hidden">Web</span>
								</Button>
							}
						/>
						<TooltipContent>Ctrl+Shift+S</TooltipContent>
					</Tooltip>
				)}
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
