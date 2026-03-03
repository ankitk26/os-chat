import { ImagesIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import AppSidebarContent from "./app-sidebar-content";
import AppSidebarFooter from "./app-sidebar-footer";
import AppSidebarHeader from "./app-sidebar-header";
import AppSidebarNewChatButton from "./app-sidebar-new-chat-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<AppSidebarHeader />
				<AppSidebarNewChatButton />
				<SidebarGroup className="py-1">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<Tooltip>
									<TooltipTrigger
										render={
											<Link to="/gallery" className="flex w-full">
												<SidebarMenuButton className="bg-sidebar border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full min-w-8 cursor-pointer items-center justify-center border text-center">
													<ImagesIcon className="size-4" />
													<span>View Gallery</span>
												</SidebarMenuButton>
											</Link>
										}
									/>
									<TooltipContent>View Gallery</TooltipContent>
								</Tooltip>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarHeader>

			<SidebarContent>
				<AppSidebarContent />
			</SidebarContent>

			<SidebarFooter>
				<AppSidebarFooter />
			</SidebarFooter>
		</Sidebar>
	);
}
