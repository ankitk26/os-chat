import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import {
	CheckIcon,
	CopyIcon,
	ExternalLinkIcon,
	GlobeIcon,
	Loader,
	LockIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ShareChatAccessHandler() {
	const selectedChat = useChatActionStore((store) => store.selectedChat);

	const [copied, setCopied] = useState(false);

	const canShare = Boolean(selectedChat);

	const queryArgs = selectedChat
		? {
				chatId: selectedChat._id,
			}
		: "skip";

	const { data: sharedUuid, isPending } = useQuery(
		convexQuery(api.chats.getSharedChatStatus, queryArgs),
	);

	const shareMutation = useMutation({
		mutationFn: useConvexMutation(api.chats.createSharedChat),
		onError: () => toast.error("Failed to update share status"),
	});

	const isPublic = Boolean(sharedUuid);
	const isLoading = isPending || shareMutation.isPending;
	const shareUrl = sharedUuid
		? `${window.location.origin}/share/${sharedUuid}`
		: null;

	function handleToggleShare() {
		if (!selectedChat) {
			return;
		}
		shareMutation.mutate({
			chatId: selectedChat._id,
			sharedChatUuid: generateRandomUUID(),
		});
	}

	function handleCopyLink() {
		if (!shareUrl) {
			return;
		}
		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				setCopied(true);
				toast.success("Link copied to clipboard");
			})
			.catch(() => toast.error("Failed to copy link"));
	}

	function handleOpenInNewTab() {
		if (shareUrl) {
			window.open(shareUrl, "_blank");
		}
	}

	return (
		<div className="space-y-4">
			<div className="bg-card flex items-center justify-between rounded-lg border p-4">
				<div className="flex items-center gap-3">
					<div className="bg-background flex h-8 w-8 items-center justify-center rounded-full">
						{isLoading ? (
							<Loader className="text-muted-foreground h-4 w-4 animate-spin" />
						) : isPublic ? (
							<GlobeIcon className="text-primary h-4 w-4" />
						) : (
							<LockIcon className="text-muted-foreground h-4 w-4" />
						)}
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Label className="text-sm font-medium">Public Access</Label>
							<Badge
								className="text-xs"
								variant={isPublic ? "default" : "secondary"}
							>
								{isPublic ? "Active" : "Disabled"}
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
			{Boolean(shareUrl) && (
				<div className="space-y-3">
					<Label className="text-sm font-medium">Share Link</Label>
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Input
								className="pr-10 font-mono text-sm"
								readOnly
								value={shareUrl ?? ""}
							/>
							<Button
								className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
								disabled={isLoading}
								onClick={handleCopyLink}
								size="sm"
								variant="ghost"
							>
								{copied ? (
									<CheckIcon className="text-primary h-3 w-3" />
								) : (
									<CopyIcon className="h-3 w-3" />
								)}
							</Button>
						</div>
						<Button
							className="shrink-0"
							disabled={isLoading}
							onClick={handleOpenInNewTab}
							size="icon"
							variant="outline"
						>
							<ExternalLinkIcon className="h-4 w-4" />
						</Button>
					</div>
					<p className="text-muted-foreground text-xs">
						Messages up to this point will be visible to anyone with this link
					</p>
				</div>
			)}
		</div>
	);
}
