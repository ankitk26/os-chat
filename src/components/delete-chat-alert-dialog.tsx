import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
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
  const { chatId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { auth } = useRouteContext({ strict: false });
  const selectedChat = useChatActionStore((store) => store.selectedChat);
  const isDeleteModalOpen = useChatActionStore(
    (store) => store.isDeleteModalOpen
  );
  const setIsDeleteModalOpen = useChatActionStore(
    (store) => store.setIsDeleteModalOpen
  );
  const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);

  const deleteChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.deleteChat),
    onSuccess: async () => {
      if (selectedChat?.uuid === chatId) {
        await navigate({ to: "/" });
      }
      toast.success("Chat was deleted");
      setIsDeleteModalOpen(false);
      setSelectedChat(null);
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
      open={isDeleteModalOpen}
      onOpenChange={(open) => setIsDeleteModalOpen(open)}
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
            disabled={deleteChatMutation.isPending}
            onClick={() =>
              deleteChatMutation.mutate({
                chatId: selectedChat?._id!,
                sessionToken: auth?.session.token ?? "",
              })
            }
          >
            {deleteChatMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
