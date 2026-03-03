import type { Id } from "convex/_generated/dataModel";

interface GalleryImageItemProps {
	image: {
		_id: Id<"imageGenerations">;
		_creationTime: number;
		userId: Id<"users">;
		storageId: Id<"_storage">;
		generatedImageUrl: string;
	};
}

export default function GalleryImageItem({ image }: GalleryImageItemProps) {
	return (
		<div className="group bg-muted relative aspect-square overflow-hidden rounded-lg border">
			<img
				src={image.generatedImageUrl}
				alt="Generated"
				className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
		</div>
	);
}
