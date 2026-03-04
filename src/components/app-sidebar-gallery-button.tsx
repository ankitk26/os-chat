import { ImagesIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "~/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AppSidebarGalleryButton() {
	const { isMobile, setOpenMobile } = useSidebar();

	const handleClick = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<SidebarGroup className="py-1">
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<Tooltip>
							<TooltipTrigger
								render={
									<Link
										to="/gallery"
										className="flex w-full"
										onClick={handleClick}
									>
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
	);
}
