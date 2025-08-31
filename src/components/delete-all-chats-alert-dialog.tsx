import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSharedChatContext } from "~/providers/chat-provider";
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

export default function DeleteAllChatsAlertDialog() {
  const { auth } = useRouteContext({ strict: false });
  const { clearChat } = useSharedChatContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const deleteAllChatsMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.deleteAll),
    onSuccess: () => {
      toast.success("All messages deleted");
      clearChat();
      navigate({ to: "/" });
    },
  });

  return (
    <AlertDialog
      onOpenChange={(val) => setIsDialogOpen(val)}
      open={isDialogOpen}
    >
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="opacity-0 group-hover/chat-header:opacity-100"
              onClick={() => setIsDialogOpen(true)}
              size="icon"
              variant="ghost"
            >
              <TrashIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete all chats</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete all chats</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all chats? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteAllChatsMutation.isPending}
            onClick={() => {
              toast.info("Deleting all chats...");
              deleteAllChatsMutation.mutate({
                sessionToken: auth?.session.token ?? "",
              });
            }}
          >
            {deleteAllChatsMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
