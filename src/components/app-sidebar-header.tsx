import { Link } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import { ThemeToggler } from "./theme-toggle";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "./ui/sidebar";

export default function AppSidebarHeader() {
	const { clearChat } = useSharedChatContext();

	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex items-center gap-1">
				<SidebarTrigger className="h-8 w-8" />
				<Link
					onClick={() => clearChat()}
					to="/"
					className="flex flex-1 justify-center"
				>
					<SidebarMenuButton
						tooltip="os-chat"
						className="w-full justify-center"
					>
						<span className="text-base font-medium">os-chat</span>
					</SidebarMenuButton>
				</Link>
				<ThemeToggler />
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
