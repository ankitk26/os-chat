import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { CheckIcon, CopyIcon, Link2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { authQueryOptions } from "~/queries/auth";
import { useChatActionStore } from "~/stores/chat-actions-store";
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
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ShareChatDialog() {
  const { data: authData } = useQuery(authQueryOptions);
  const [copied, setCopied] = useState(false);

  const selectedChat = useChatActionStore((store) => store.selectedChat);
  const isShareDialogOpen = useChatActionStore(
    (store) => store.isShareDialogOpen
  );
  const setIsShareDialogOpen = useChatActionStore(
    (store) => store.setIsShareDialogOpen
  );

  const { data: sharedUuid, isPending } = useQuery(
    convexQuery(
      api.chats.getSharedChatStatus,
      selectedChat && authData?.session.token
        ? {
            chatId: selectedChat._id,
            sessionToken: authData.session.token,
          }
        : "skip"
    )
  );

  const shareMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createSharedChat),
    onError: () => toast.error("Failed to share chat"),
  });

  const isPublic = Boolean(sharedUuid);
  const shareUrl = sharedUuid
    ? `${window.location.origin}/share/${sharedUuid}`
    : null;

  const handleToggleShare = () => {
    if (!selectedChat || !authData?.session.token) return;

    shareMutation.mutate({
      chatId: selectedChat._id,
      sessionToken: authData.session.token,
      sharedChatUuid: generateRandomUUID(),
    });
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!isShareDialogOpen) setCopied(false);
  }, [isShareDialogOpen]);

  const isLoading = isPending || shareMutation.isPending;
  const canShare = selectedChat && authData?.session.token;

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
      <DialogContent key={selectedChat?._id}>
        <DialogHeader>
          <DialogTitle>Share chat</DialogTitle>
          <DialogDescription>
            Only messages up until now will be shared. Anyone with the link can
            view this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Make chat public</Label>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Checking status..."
                  : isPublic
                  ? "This chat is publicly accessible"
                  : "This chat is private"}
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleToggleShare}
              disabled={!canShare || isLoading}
            />
          </div>

          {shareUrl && (
            <div className="space-y-2">
              <Label>Share link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  disabled={isLoading}
                >
                  {copied ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
          {shareUrl && (
            <Button onClick={handleCopyLink} disabled={isLoading}>
              {copied ? (
                <>
                  <CheckIcon className="size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2Icon className="size-4" />
                  Copy Link
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
