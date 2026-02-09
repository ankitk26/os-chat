import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { PinIcon } from "lucide-react";
import { toast } from "sonner";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemPin(props: Props) {
	const toggleChatPinMutation = useMutation({
		mutationFn: useConvexMutation(api.chats.toggleChatPin),
		onSuccess: (wasPinned) => {
			toast.success(wasPinned ? "Chat unpinned" : "Chat pinned");
		},
		onError: () => {
			toast.error("Could not pin chat", {
				description: "Please try again later",
			});
		},
	});

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				toggleChatPinMutation.mutate({
					chatId: props.chat._id,
				});
			}}
		>
			<PinIcon />
			<span className="leading-0">{props.chat.isPinned ? "Unpin" : "Pin"}</span>
		</DropdownMenuItem>
	);
}
