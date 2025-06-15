import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { authQueryOptions } from "~/queries/auth";
import { useChatActionsStore } from "~/stores/chat-actions-store";
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
  const { data: authData } = useSuspenseQuery(authQueryOptions);
  const chat = useChatActionsStore((store) => store.chat);
  const isToBeDeleted = useChatActionsStore((store) => store.isToBeDeleted);
  const setIsToBeDeleted = useChatActionsStore(
    (store) => store.setIsToBeDeleted
  );
  const setChat = useChatActionsStore((store) => store.setChat);

  const deleteChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.deleteChat),
    onSuccess: async () => {
      if (chat?.uuid === chatId) {
        await navigate({ to: "/" });
      }
      toast.success("Chat was deleted");
      setIsToBeDeleted(false);
      setChat(null);
    },
    onError: () => {
      toast.error("Chat was not deleted", {
        description: "Please try again later",
      });
      setChat(null);
    },
  });

  return (
    <AlertDialog
      open={isToBeDeleted}
      onOpenChange={(open) => setIsToBeDeleted(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the chat "{chat?.title}"? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteChatMutation.isPending}
            onClick={() =>
              deleteChatMutation.mutate({
                chatId: chat?._id!,
                sessionToken: authData?.session.token ?? "",
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
