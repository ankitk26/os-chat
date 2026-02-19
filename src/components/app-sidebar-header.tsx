import { Link } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import { ThemeToggler } from "./theme-toggle";
import { SidebarMenu, SidebarMenuItem, SidebarTrigger } from "./ui/sidebar";

export default function AppSidebarHeader() {
	const { clearChat } = useSharedChatContext();

	return (
		<SidebarMenu className="py-1">
			<SidebarMenuItem className="flex items-center gap-1">
				<SidebarTrigger className="h-8 w-8" />
				<Link
					onClick={() => clearChat()}
					to="/"
					className="flex flex-1 items-center justify-center text-base font-medium"
				>
					os-chat
				</Link>
				<ThemeToggler />
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
