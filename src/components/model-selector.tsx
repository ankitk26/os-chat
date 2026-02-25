import { ChevronDownIcon, KeyIcon } from "lucide-react";
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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function ModelSelector() {
	const selectedModel = useModelStore((store) => store.selectedModel);
	const setSelectedModel = useModelStore((store) => store.setSelectedModel);

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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				{selectedModel.name}
				<ChevronDownIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50">
				{accessibleModels.map((provider) => (
					<DropdownMenuSub key={provider.key}>
						<DropdownMenuSubTrigger className="flex items-center gap-3 py-2.5 text-xs">
							<ModelProviderIcon provider={provider.key} />
							{provider.provider}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="ml-2 w-50 rounded-lg">
								{provider.models.map((model) => (
									<DropdownMenuItem
										className="py-2.5 text-xs"
										disabled={!model.isAvailable}
										key={model.modelId}
										onClick={() => {
											setSelectedModel(model);
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
