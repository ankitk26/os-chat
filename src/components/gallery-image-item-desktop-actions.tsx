import { DownloadIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import DeleteImageGenerationButton from "./delete-image-generation-button";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	image: FunctionReturnType<typeof api.imageGenerations.getAll>[0];
	handleDownload: () => void;
	handleShare: () => void;
};

export default function GalleryImageItemDesktopActions(props: Props) {
	return (
		<div
			className="absolute right-0 bottom-0 left-0 hidden items-center justify-center gap-2 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:flex"
			onClick={(e) => e.stopPropagation()}
		>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="hover:backdrop-blur-sm"
							onClick={props.handleDownload}
						>
							<DownloadIcon className="h-4 w-4" />
						</Button>
					}
				/>
				<TooltipContent side="bottom">Download</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="hover:backdrop-blur-sm"
							onClick={props.handleShare}
						>
							<ShareNetworkIcon className="h-4 w-4" />
						</Button>
					}
				/>
				<TooltipContent side="bottom">Copy link</TooltipContent>
			</Tooltip>

			<DeleteImageGenerationButton storageId={props.image.storageId} />
		</div>
	);
}
