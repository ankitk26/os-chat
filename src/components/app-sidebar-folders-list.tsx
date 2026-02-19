import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import AppSidebarFolderItem from "./app-sidebar-folder-item";
import { SidebarMenu } from "./ui/sidebar";

export default function AppSidebarFoldersList() {
	const { data: folders } = useSuspenseQuery(
		convexQuery(api.folders.getFoldersWithChats),
	);

	if (folders.length === 0) {
		return (
			<SidebarMenu>
				<p className="text-sidebar-foreground/70 px-2 py-1 text-xs">
					No folders
				</p>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			{folders.map((folder) => (
				<AppSidebarFolderItem folder={folder} key={folder._id} />
			))}
		</SidebarMenu>
	);
}
