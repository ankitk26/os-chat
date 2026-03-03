import { DownloadIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { Button } from "~/components/ui/button";
import DeleteImageGenerationButton from "./delete-image-generation-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	image: FunctionReturnType<typeof api.imageGenerations.getAll>[0];
};

export default function GalleryImageItem({ image }: Props) {
	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = image.generatedImageUrl;
		link.download = `image-${image._id}.png`;
		link.click();
	};

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(image.generatedImageUrl);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className="group relative overflow-hidden rounded-lg border">
			<img
				src={image.generatedImageUrl}
				alt="Generated"
				className="h-auto w-full"
				loading="lazy"
			/>

			{/* Gradient overlay for contrast */}
			<div className="absolute right-0 bottom-0 left-0 h-20 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

			{/* Action buttons - appear on hover */}
			<div className="absolute right-0 bottom-0 left-0 flex items-center justify-center gap-2 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-white hover:bg-white/20 hover:backdrop-blur-sm"
								onClick={handleDownload}
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
								className="h-8 w-8 text-white hover:bg-white/20 hover:backdrop-blur-sm"
								onClick={handleShare}
							>
								<ShareNetworkIcon className="h-4 w-4" />
							</Button>
						}
					/>
					<TooltipContent side="bottom">Copy link</TooltipContent>
				</Tooltip>

				<DeleteImageGenerationButton storageId={image.storageId} />
			</div>
		</div>
	);
}
