import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { type FormEvent, useRef, useState } from "react";
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

export default function AddFolderDialog() {
  const isCreateModalOpen = useFolderActionStore(
    (store) => store.isCreateModalOpen,
  );
  const setIsCreateModalOpen = useFolderActionStore(
    (store) => store.setIsCreateModalOpen,
  );
  const [folderTitle, setFolderTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const createFolderMutation = useMutation({
    mutationFn: useConvexMutation(api.folders.createFolder),
    onSuccess: () => {
      setFolderTitle("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!folderTitle) {
      return;
    }

    createFolderMutation.mutate({
      title: folderTitle,
    });
  };

  return (
    <Dialog
      onOpenChange={(open) => setIsCreateModalOpen(open)}
      open={isCreateModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your chats
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            disabled={createFolderMutation.isPending}
            onChange={(e) => setFolderTitle(e.target.value)}
            placeholder="Project Ideas"
            ref={inputRef}
            value={folderTitle}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={createFolderMutation.isPending}
            onClick={handleSubmit}
          >
            {createFolderMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
