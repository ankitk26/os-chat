import { Link, useRouteContext } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "./ui/sidebar";

export default function AppSidebarFooter() {
	const { authUser } = useRouteContext({ strict: false });
	const { isMobile, setOpenMobile } = useSidebar();

	const handleClick = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Link to="/settings" className="flex w-full" onClick={handleClick}>
					<SidebarMenuButton
						size="lg"
						tooltip={authUser?.name || "Settings"}
						className="w-full"
					>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage
								alt={authUser?.name?.[0]}
								src={authUser?.image ?? ""}
							/>
							<AvatarFallback className="rounded-lg">
								{(authUser?.name ?? "")
									.split(" ")
									.slice(0, 2)
									.map((namePart) => namePart.charAt(0))
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{authUser?.name}</span>
							<span className="text-muted-foreground truncate text-xs">
								{authUser?.email}
							</span>
						</div>
						<SettingsIcon className="ml-auto" />
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
