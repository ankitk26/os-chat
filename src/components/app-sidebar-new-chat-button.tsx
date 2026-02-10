import { useNavigate } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import {
	SidebarGroup,
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

	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem className="flex items-center gap-2">
					<SidebarMenuButton
						className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground flex w-full min-w-8 cursor-pointer items-center justify-center text-center font-semibold duration-200 ease-linear"
						onClick={handleNewChat}
						size="default"
					>
						New Chat
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
