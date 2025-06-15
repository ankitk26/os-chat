import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { PlusIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function AddFolderButton() {
  const { data } = authClient.useSession();
  const [folderName, setFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.folders.createFolder),
    onSuccess: () => {
      toast.success("Folder created");
      setFolderName("");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Folder was not created", {
        description: "Please try again later",
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (folderName.trim().length === 0) {
      return;
    }
    mutate({
      sessionToken: data?.session.token ?? "",
      title: folderName.trim(),
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new folder</DialogTitle>
          <DialogDescription>
            Group your chats under one folder
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder Name"
            disabled={isPending}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button size="sm" disabled={isPending} onClick={handleSubmit}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
