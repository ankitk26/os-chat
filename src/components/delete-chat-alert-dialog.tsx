import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { useSharedChatContext } from "~/providers/chat-provider";
import { useChatActionStore } from "~/stores/chat-actions-store";
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

export default function DeleteChatAlertDialog() {
	const { clearChat } = useSharedChatContext();
	const { chatId } = useParams({ strict: false });
	const navigate = useNavigate();
	const selectedChat = useChatActionStore((store) => store.selectedChat);
	const isDeleteModalOpen = useChatActionStore(
		(store) => store.isDeleteModalOpen,
	);
	const setIsDeleteModalOpen = useChatActionStore(
		(store) => store.setIsDeleteModalOpen,
	);
	const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);

	const deleteChatMutation = useMutation({
		mutationFn: useConvexMutation(api.chats.deleteChat),
		onSuccess: () => {
			const isCurrentChatOpened = selectedChat?.uuid === chatId;
			toast.success("Chat was deleted");
			setIsDeleteModalOpen(false);
			setSelectedChat(null);

			if (isCurrentChatOpened) {
				clearChat();
				navigate({ to: "/" });
			}
		},
		onError: () => {
			toast.error("Chat was not deleted", {
				description: "Please try again later",
			});
			setSelectedChat(null);
		},
	});

	return (
		<AlertDialog
			onOpenChange={(open) => setIsDeleteModalOpen(open)}
			open={isDeleteModalOpen}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete chat</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the chat "{selectedChat?.title}"?
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={deleteChatMutation.isPending}
						onClick={() => {
							if (!selectedChat) {
								toast.error("No chat selected to delete.");
								return;
							}
							deleteChatMutation.mutate({
								chatId: selectedChat._id,
							});
						}}
					>
						{deleteChatMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
