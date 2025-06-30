import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function RenameFolderDialog() {
  const { auth } = useRouteContext({ strict: false });
  const selectedFolder = useFolderActionStore((store) => store.selectedFolder);
  const setSelectedFolder = useFolderActionStore(
    (store) => store.setSelectedFolder
  );
  const isRenameModalOpen = useFolderActionStore(
    (store) => store.isRenameModalOpen
  );
  const setIsRenameModalOpen = useFolderActionStore(
    (store) => store.setIsRenameModalOpen
  );

  const [newFolderTitle, setNewFolderTitle] = useState("");

  useEffect(() => {
    if (selectedFolder?.title) {
      setNewFolderTitle(selectedFolder.title);
    }
  }, [selectedFolder?.title]);

  const renameFolderMutation = useMutation({
    mutationFn: useConvexMutation(api.folders.renameFolder),
    onSuccess: () => {
      toast.success("Folder renamed");
    },
    onError: () => {
      toast.error("Folder was not renamed", {
        description: "Please try again later",
      });
    },
    onSettled: () => {
      setIsRenameModalOpen(false);
      setNewFolderTitle("");
      setSelectedFolder(null);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newFolderTitle === selectedFolder?.title) {
      return;
    }

    renameFolderMutation.mutate({
      folder: { id: selectedFolder?._id!, title: newFolderTitle },
      sessionToken: auth?.session.token ?? "",
    });
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(open) => setIsRenameModalOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename folder title</DialogTitle>
          <DialogDescription>
            Rename title for the folder "{selectedFolder?.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Input
            value={newFolderTitle}
            onChange={(e) => setNewFolderTitle(e.target.value)}
            disabled={renameFolderMutation.isPending}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              renameFolderMutation.isPending ||
              selectedFolder?.title === newFolderTitle
            }
            onClick={handleSubmit}
          >
            {renameFolderMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
