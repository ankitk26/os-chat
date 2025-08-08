import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  Link2Icon,
  LockIcon,
  RefreshCwIcon,
  ShareIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Badge } from "./ui/badge";
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
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: To fix later
export default function ShareChatDialog() {
  const { auth } = useRouteContext({ strict: false });
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
      selectedChat && auth?.session.token
        ? {
            chatId: selectedChat._id,
            sessionToken: auth?.session.token,
          }
        : "skip"
    )
  );

  const shareMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createSharedChat),
    onError: () => toast.error("Failed to share chat"),
  });

  const syncHistoryMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.syncSharedChat),
    onSuccess: () => toast.success("Synced chat history"),
    onError: () => toast.error("Failed to sync chat history"),
  });

  const isPublic = Boolean(sharedUuid);
  const shareUrl = sharedUuid
    ? `${window.location.origin}/share/${sharedUuid}`
    : null;

  const isLoading = isPending || shareMutation.isPending;
  const canShare = Boolean(selectedChat && auth?.session.token);

  function handleCopyLink() {
    if (!shareUrl) {
      return;
    }
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 500);
      })
      .catch(() => toast.error("Failed to copy link"));
  }

  function handleToggleShare() {
    if (!(selectedChat && auth?.session.token)) {
      return;
    }
    shareMutation.mutate({
      chatId: selectedChat._id,
      sessionToken: auth?.session.token,
      sharedChatUuid: generateRandomUUID(),
    });
  }

  function handleSyncHistory() {
    if (!(selectedChat && auth?.session.token)) {
      return;
    }
    syncHistoryMutation.mutate({
      sessionToken: auth?.session.token,
      chatId: selectedChat._id,
    });
  }

  function handleOpenInNewTab() {
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setCopied(false);
    }
    setIsShareDialogOpen(open);
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange} open={isShareDialogOpen}>
      <DialogContent className="sm:max-w-md" key={selectedChat?._id}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ShareIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">Share Chat</DialogTitle>
              <DialogDescription className="text-left">
                Share this conversation with others
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Public/Private Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background">
                  {isPublic ? (
                    <GlobeIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium text-sm">Public Access</Label>
                    <Badge
                      className="text-xs"
                      variant={isPublic ? "default" : "secondary"}
                    >
                      {isLoading && "Updating..."}
                      {!isLoading && isPublic ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {isPublic
                      ? "Anyone with the link can view this chat"
                      : "Only you can access this chat"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isPublic}
                disabled={!canShare || isLoading}
                onCheckedChange={handleToggleShare}
              />
            </div>

            {/* Share Link */}
            {shareUrl && (
              <div className="space-y-3">
                <Label className="font-medium text-sm">Share Link</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      className="pr-10 font-mono text-sm"
                      readOnly
                      value={shareUrl}
                    />
                    <Button
                      className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7 p-0"
                      disabled={isLoading}
                      onClick={handleCopyLink}
                      size="sm"
                      variant="ghost"
                    >
                      {copied ? (
                        <CheckIcon className="h-3 w-3 text-primary" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <Button
                    className="shrink-0"
                    disabled={isLoading}
                    onClick={handleOpenInNewTab}
                    size="sm"
                    variant="outline"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Messages up to this point will be visible to anyone with this
                  link
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Sync Section */}
          <div className="space-y-3">
            <Label className="font-medium text-sm">Chat History</Label>
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div className="space-y-1">
                <p className="font-medium text-sm">Sync Latest Messages</p>
                <p className="text-muted-foreground text-xs">
                  Update shared chat with recent messages
                </p>
              </div>
              <Button
                className="shrink-0"
                disabled={
                  !canShare || syncHistoryMutation.isPending || !isPublic
                }
                onClick={handleSyncHistory}
                size="sm"
                variant="outline"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 ${
                    syncHistoryMutation.isPending ? "animate-spin" : ""
                  }`}
                />
                {syncHistoryMutation.isPending ? "Syncing..." : "Sync"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-auto"
              disabled={isLoading}
              variant="outline"
            >
              Close
            </Button>
          </DialogClose>
          {shareUrl && (
            <Button
              className="w-full sm:w-auto"
              disabled={isLoading}
              onClick={handleCopyLink}
            >
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
