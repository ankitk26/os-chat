import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

type Props = {
	storageId: Id<"_storage">;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function DeleteImageDialog({
	storageId,
	open,
	onOpenChange,
}: Props) {
	const deleteImageGenerationMutation = useMutation({
		mutationFn: useConvexMutation(api.imageGenerations.deleteImage),
		onSuccess: () => {
			onOpenChange(false);
		},
	});

	const handleDelete = () => {
		deleteImageGenerationMutation.mutate({ storageId });
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
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
