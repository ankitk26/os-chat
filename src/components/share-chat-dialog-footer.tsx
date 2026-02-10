import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { CheckIcon, Link2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";

export default function ShareChatDialogFooter() {
	const selectedChat = useChatActionStore((store) => store.selectedChat);
	const [copied, setCopied] = useState(false);

	const { data: sharedUuid, isPending } = useQuery(
		convexQuery(
			api.chats.getSharedChatStatus,
			selectedChat
				? {
						chatId: selectedChat._id,
					}
				: "skip",
		),
	);

	const shareUrl = sharedUuid
		? `${window.location.origin}/share/${sharedUuid}`
		: null;
	const isLoading = isPending;

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

	return (
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
			{Boolean(shareUrl) && (
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
	);
}
