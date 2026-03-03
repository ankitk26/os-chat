import { useConvexMutation } from "@convex-dev/react-query";
import { TrashIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	storageId: Id<"_storage">;
};

export default function DeleteImageGenerationButton(props: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const deleteImageGenerationMutation = useMutation({
		mutationFn: useConvexMutation(api.imageGenerations.deleteImage),
	});

	const handleDelete = () => {
		deleteImageGenerationMutation.mutate({ storageId: props.storageId });
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<Tooltip>
				<TooltipTrigger
					render={
						<AlertDialogTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-white hover:bg-white/20 hover:backdrop-blur-sm"
								>
									<TrashIcon className="h-4 w-4" />
								</Button>
							}
						/>
					}
				/>
				<TooltipContent side="bottom">Delete</TooltipContent>
			</Tooltip>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete image</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this image? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteImageGenerationMutation.isPending}
					>
						{deleteImageGenerationMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
