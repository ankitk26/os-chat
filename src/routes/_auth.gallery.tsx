import { convexQuery } from "@convex-dev/react-query";
import { ImagesIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import GalleryImageItem from "~/components/gallery-image-item";
import { ScrollArea } from "~/components/ui/scroll-area";

export const Route = createFileRoute("/_auth/gallery")({
	component: RouteComponent,
	loader: async ({ context }) => {
		return await context.queryClient.ensureQueryData(
			convexQuery(api.imageGenerations.getAll),
		);
	},
});

function RouteComponent() {
	const imageGenerations: {
		_id: Id<"imageGenerations">;
		_creationTime: number;
		userId: Id<"users">;
		storageId: Id<"_storage">;
		generatedImageUrl: string;
	}[] = Route.useLoaderData();

	return (
		<section className="h-svh max-h-svh py-4 pb-8 lg:py-6 lg:pb-12">
			<ScrollArea className="h-full w-full">
				<div className="mx-auto w-full max-w-5xl space-y-4 px-4 pb-20 lg:space-y-6 lg:px-6 lg:pb-12">
					{/* Header */}
					<div className="flex items-center gap-3">
						<ImagesIcon className="h-6 w-6 lg:h-8 lg:w-8" />
						<h1 className="text-2xl font-bold lg:text-3xl">Gallery</h1>
					</div>

					{/* Gallery Grid */}
					{imageGenerations.length === 0 ? (
						<div className="text-muted-foreground py-12 text-center">
							<ImagesIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p className="text-lg font-medium">No images yet</p>
							<p className="text-sm">Generated images will appear here</p>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
							{imageGenerations.map((image) => (
								<GalleryImageItem key={image._id} image={image} />
							))}
						</div>
					)}
				</div>
			</ScrollArea>
		</section>
	);
}
