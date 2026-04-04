import { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import GeneratedImageViewerDesktopActions from "./generated-image-viewer-desktop-actions";
import GeneratedImageViewerMobileActions from "./generated-image-viewer-mobile-actions";

type Props = {
	alt?: string;
	className?: string;
	imageUrl: string;
	imgClassName?: string;
	loading?: "eager" | "lazy";
	mobileActionsSide?: "left" | "right";
	storageId?: Id<"_storage">;
	triggerClassName?: string;
	wrapperClassName?: string;
};

export default function GeneratedImageViewer({
	alt = "Generated image",
	className = "pb-2",
	imageUrl,
	imgClassName = "h-auto w-full",
	loading = "lazy",
	mobileActionsSide = "right",
	storageId,
	triggerClassName = "block w-full cursor-pointer p-0",
	wrapperClassName = "group relative overflow-hidden rounded-lg border",
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDownload = async () => {
		try {
			const response = await fetch(imageUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch image");
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const now = new Date();
			const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `baychat image ${dateStr}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);

			toast.success("Download started");
		} catch {
			toast.error("Failed to download image");
		}
	};

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(imageUrl);
			toast.success("Link copied");
		} catch {
			toast.error("Something went wrong");
		}
	};

	return (
		<div className={className}>
			<div className={wrapperClassName}>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger
						render={
							<button type="button" className={triggerClassName}>
								<img
									src={imageUrl}
									alt={alt}
									className={imgClassName}
									loading={loading}
								/>
							</button>
						}
					/>

					<DialogContent className="w-auto overflow-hidden border-none bg-black/95 p-0 shadow-none sm:max-w-none">
						<DialogTitle className="sr-only">Image Viewer</DialogTitle>
						<img
							src={imageUrl}
							alt={alt}
							className="max-h-[95vh] max-w-[95vw] rounded-lg object-contain"
						/>
					</DialogContent>
				</Dialog>

				<div className="absolute right-0 bottom-0 left-0 hidden h-20 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:flex" />

				<GeneratedImageViewerDesktopActions
					handleDownload={handleDownload}
					handleShare={handleShare}
					storageId={storageId}
				/>
			</div>

			<GeneratedImageViewerMobileActions
				handleDownload={handleDownload}
				handleShare={handleShare}
				side={mobileActionsSide}
				storageId={storageId}
			/>
		</div>
	);
}
