import {
	GlobeIcon,
	PaperclipIcon,
	PaperPlaneRightIcon,
	SpinnerIcon,
	StopIcon,
} from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { ChatStatus } from "ai";
import { cn } from "~/lib/utils";
import { modelStoreActions, useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import ModelSelector from "./model-selector";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	attachmentCount?: number;
	disabled?: boolean;
	isUploading?: boolean;
	onAttachClick?: () => void;
	status: ChatStatus;
	stop: () => void;
};

export default function PromptActions({
	attachmentCount = 0,
	disabled = false,
	isUploading = false,
	onAttachClick,
	status,
	stop,
}: Props) {
	const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
	const selectedModel = useModelStore((store) => store.selectedModel);
	const persistedUseOpenRouter = usePersistedApiKeysStore(
		(store) => store.persistedUseOpenRouter,
	);

	useHotkey("Mod+Shift+S", modelStoreActions.toggleIsWebSearch);

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
									onClick={modelStoreActions.toggleIsWebSearch}
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

				<Button
					className={cn(
						"transition-all duration-300 ease-out",
						attachmentCount > 0 &&
							"border-primary/60 bg-primary/8 text-foreground",
					)}
					disabled={disabled}
					onClick={onAttachClick}
					type="button"
					variant="outline"
				>
					{isUploading ? (
						<>
							<SpinnerIcon className="size-4 animate-spin" />
							<span>Uploading...</span>
						</>
					) : (
						<>
							<PaperclipIcon />
							<span className="hidden sm:inline">Upload</span>
							<span className="sm:hidden">File</span>
						</>
					)}
					{!isUploading && attachmentCount > 0 && (
						<span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
							{attachmentCount}
						</span>
					)}
				</Button>
			</div>

			{status === "streaming" || status === "submitted" ? (
				<Button onClick={stop} size="icon" type="button">
					<StopIcon />
				</Button>
			) : (
				<Button size="icon" type="submit">
					<PaperPlaneRightIcon />
				</Button>
			)}
		</div>
	);
}
