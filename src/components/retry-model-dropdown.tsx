import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { GlobeIcon, KeyIcon, RefreshCcwIcon } from "lucide-react";
import type { CustomUIMessage, Model } from "~/types";
import { getAccessibleModels } from "~/lib/get-accessible-models";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import ModelProviderIcon from "./model-provider-icon";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSeparatorWithText,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	message: CustomUIMessage;
	regenerate: UseChatHelpers<CustomUIMessage>["regenerate"];
};

export default function RetryModelDropdown(props: Props) {
	const { message, regenerate } = props;
	const { chatId } = useParams({ strict: false });
	const selectedModel = useModelStore((store) => store.selectedModel);
	const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
	const toggleIsWebSearch = useModelStore((store) => store.toggleIsWebSearch);
	const persistedApiKeys = usePersistedApiKeysStore(
		(store) => store.persistedApiKeys,
	);
	const persistedUseOpenRouter = usePersistedApiKeysStore(
		(store) => store.persistedUseOpenRouter,
	);

	const accessibleModels = getAccessibleModels(
		persistedApiKeys,
		persistedUseOpenRouter,
	);

	const deleteMessagesMutation = useMutation({
		mutationFn: useConvexMutation(api.messages.deleteMessagesByTimestamp),
	});

	const handleRetry = async (model: Model) => {
		if (!chatId) {
			return;
		}

		// delete all messages after current message in current chat
		deleteMessagesMutation.mutate({
			currentMessageSourceId: message.id,
			chatId,
			deleteCurrentMessage: message.role === "assistant",
		});

		await regenerate({
			messageId: message.id,
			body: {
				model,
				isWebSearchEnabled,
				apiKeys: persistedApiKeys,
				useOpenRouter: persistedUseOpenRouter,
				chatId,
			},
		});
	};

	if (!chatId) {
		return null;
	}

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
			<DropdownMenuContent className="w-[200px]">
				{/* Web Search switch */}
				<div className="flex items-center justify-between px-2 py-3">
					<div className="flex items-center gap-2">
						<GlobeIcon className="size-4" />
						<span className="text-xs">Web Search</span>
					</div>
					<Switch
						checked={isWebSearchEnabled}
						onCheckedChange={toggleIsWebSearch}
					/>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="flex items-center gap-3 text-xs"
					onClick={async () => {
						await handleRetry(selectedModel);
					}}
				>
					<RefreshCcwIcon className="size-4" />
					Retry same
				</DropdownMenuItem>

				<DropdownMenuSeparatorWithText>
					or switch model
				</DropdownMenuSeparatorWithText>

				{accessibleModels.map((provider) => (
					<DropdownMenuSub key={provider.key}>
						<DropdownMenuSubTrigger className="flex items-center gap-3 py-3 text-xs">
							<ModelProviderIcon provider={provider.key} />
							{provider.provider}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="ml-2 w-[200px]">
								{provider.models.map((model) => (
									<DropdownMenuItem
										className="py-3 text-xs"
										disabled={!model.isAvailable}
										key={model.modelId}
										onClick={async () => {
											await handleRetry(model);
										}}
									>
										<ModelProviderIcon provider={provider.key} />
										{model.name}
										{!model.isAvailable && (
											<KeyIcon className="ml-auto size-3" />
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
