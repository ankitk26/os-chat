import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { authQueryOptions } from "~/queries/auth";
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
  const canShare = Boolean(selectedChat && authData?.session.token);

  function handleCopyLink() {
    if (!shareUrl) return;
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
    if (!selectedChat || !authData?.session.token) return;
    shareMutation.mutate({
      chatId: selectedChat._id,
      sessionToken: authData.session.token,
      sharedChatUuid: generateRandomUUID(),
    });
  }

  function handleSyncHistory() {
    if (!selectedChat || !authData?.session.token) return;
    syncHistoryMutation.mutate({
      sessionToken: authData.session.token,
      chatId: selectedChat._id,
    });
  }

  function handleOpenInNewTab() {
    if (shareUrl) window.open(shareUrl, "_blank");
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) setCopied(false);
    setIsShareDialogOpen(open);
  }

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent key={selectedChat?._id} className="sm:max-w-md">
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
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
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
                    <Label className="text-sm font-medium">Public Access</Label>
                    <Badge
                      variant={isPublic ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {isLoading
                        ? "Updating..."
                        : isPublic
                        ? "Active"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPublic
                      ? "Anyone with the link can view this chat"
                      : "Only you can access this chat"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={handleToggleShare}
                disabled={!canShare || isLoading}
              />
            </div>

            {/* Share Link */}
            {shareUrl && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share Link</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={handleCopyLink}
                      disabled={isLoading}
                    >
                      {copied ? (
                        <CheckIcon className="h-3 w-3 text-primary" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpenInNewTab}
                    disabled={isLoading}
                    className="shrink-0"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Messages up to this point will be visible to anyone with this
                  link
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Sync Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Chat History</Label>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="space-y-1">
                <p className="text-sm font-medium">Sync Latest Messages</p>
                <p className="text-xs text-muted-foreground">
                  Update shared chat with recent messages
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSyncHistory}
                disabled={
                  !canShare || syncHistoryMutation.isPending || !isPublic
                }
                className="shrink-0"
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

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogClose>
          {shareUrl && (
            <Button
              onClick={handleCopyLink}
              disabled={isLoading}
              className="w-full sm:w-auto"
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
