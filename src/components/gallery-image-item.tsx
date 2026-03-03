import { DownloadIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import DeleteImageGenerationButton from "./delete-image-generation-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	image: FunctionReturnType<typeof api.imageGenerations.getAll>[0];
};

export default function GalleryImageItem({ image }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = image.generatedImageUrl;
		link.download = `image-${image._id}.png`;
		link.click();
	};

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(image.generatedImageUrl);
			toast.success("Link copied");
		} catch {
			toast.error("Something went wrong");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<div className="group relative cursor-pointer overflow-hidden rounded-lg border">
						<img
							src={image.generatedImageUrl}
							alt="Generated"
							className="h-auto w-full"
							loading="lazy"
						/>

						{/* Gradient overlay for contrast */}
						<div className="absolute right-0 bottom-0 left-0 h-20 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

						{/* Action buttons - appear on hover */}
						<div
							className="absolute right-0 bottom-0 left-0 flex items-center justify-center gap-2 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							onClick={(e) => e.stopPropagation()}
						>
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
				}
			/>

			{/* Image Viewer Dialog */}
			<DialogContent className="w-auto overflow-hidden border-none bg-black/95 p-0 shadow-none sm:max-w-none">
				<DialogTitle className="sr-only">Image Viewer</DialogTitle>
				<img
					src={image.generatedImageUrl}
					alt="Generated"
					className="max-h-[95vh] max-w-[95vw] rounded-lg object-contain"
				/>
			</DialogContent>
		</Dialog>
	);
}
