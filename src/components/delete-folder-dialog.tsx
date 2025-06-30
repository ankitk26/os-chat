import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { useFolderActionStore } from "~/stores/folder-actions-store";
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
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function DeleteFolderAlertDialog() {
  const { auth } = useRouteContext({ strict: false });
  const selectedFolder = useFolderActionStore((store) => store.selectedFolder);
  const isDeleteModalOpen = useFolderActionStore(
    (store) => store.isDeleteModalOpen
  );
  const setIsDeleteModalOpen = useFolderActionStore(
    (store) => store.setIsDeleteModalOpen
  );
  const setSelectedFolder = useFolderActionStore(
    (store) => store.setSelectedFolder
  );

  const [deleteAllChats, setDeleteAllChats] = useState(false);

  const deleteFolderMutation = useMutation({
    mutationFn: useConvexMutation(api.folders.deleteFolder),
    onSuccess: () => {
      toast.success("Folder was deleted");
      setIsDeleteModalOpen(false);
      setSelectedFolder(null);
      setDeleteAllChats(false);
      // navigate({ to: "/" });
    },
    onError: () => {
      toast.error("Folder was not deleted", {
        description: "Please try again later",
      });
      setSelectedFolder(null);
    },
  });

  return (
    <AlertDialog
      open={isDeleteModalOpen}
      onOpenChange={(open) => setIsDeleteModalOpen(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete folder</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the folder "{selectedFolder?.title}
            "? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {selectedFolder?.chats && selectedFolder?.chats.length > 0 && (
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="delete-chats"
              checked={deleteAllChats}
              onCheckedChange={setDeleteAllChats}
              disabled={deleteFolderMutation.isPending}
            />
            <Label htmlFor="delete-chats" className="text-sm">
              Also delete all chats in this folder
            </Label>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteFolderMutation.isPending}
            onClick={() =>
              deleteFolderMutation.mutate({
                folderId: selectedFolder?._id!,
                sessionToken: auth?.session.token ?? "",
                deleteChatsFlag: deleteAllChats,
              })
            }
          >
            {deleteFolderMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
