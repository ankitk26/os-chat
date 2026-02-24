import { useHotkey } from "@tanstack/react-hotkeys";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useSharedChatContext } from "~/providers/chat-provider";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebarNewChatButton() {
	const { clearChat } = useSharedChatContext();
	const navigate = useNavigate();

	const handleNewChat = () => {
		clearChat();
		navigate({ to: "/" });
	};

	useHotkey("Mod+Shift+O", handleNewChat);

	return (
		<SidebarGroup className="py-1">
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleNewChat}
							tooltip="New Chat"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground flex w-full min-w-8 cursor-pointer items-center justify-center text-center font-semibold duration-200 ease-linear"
						>
							<PlusIcon className="size-4" />
							<span>New Chat</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
