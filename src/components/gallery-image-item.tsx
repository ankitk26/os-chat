import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import GalleryImageItemDesktopActions from "./gallery-image-item-desktop-actions";
import GalleryImageItemMobileActions from "./gallery-image-item-mobile-actions";

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
		toast.success("Download started");
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
		<div className="pb-2">
			<div className="group relative overflow-hidden rounded-lg border">
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger
						render={
							<button className="block w-full cursor-pointer p-0">
								<img
									src={image.generatedImageUrl}
									alt="Generated"
									className="h-auto w-full"
									loading="lazy"
								/>
							</button>
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

				{/* Desktop: Gradient overlay and action buttons on hover */}
				<div className="absolute right-0 bottom-0 left-0 hidden h-20 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:flex" />

				<GalleryImageItemDesktopActions
					image={image}
					handleDownload={handleDownload}
					handleShare={handleShare}
				/>
			</div>

			<GalleryImageItemMobileActions
				image={image}
				handleDownload={handleDownload}
				handleShare={handleShare}
			/>
		</div>
	);
}
