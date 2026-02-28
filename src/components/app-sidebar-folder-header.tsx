import { Folder, Plus } from "@phosphor-icons/react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import { Button } from "./ui/button";

export default function AppSidebarFolderHeader() {
	const setIsCreateModalOpen = useFolderActionStore(
		(store) => store.setIsCreateModalOpen,
	);

	return (
		<div className="flex items-center justify-between px-2 py-1.5">
			<div className="flex items-center">
				<Folder className="text-sidebar-foreground/60 mr-2 size-4" />
				<span className="text-sidebar-foreground/50 text-xs font-normal">
					Folders
				</span>
			</div>
			<Button
				onClick={() => setIsCreateModalOpen(true)}
				size="icon"
				variant="ghost"
				className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
				title="Add Folder"
			>
				<Plus className="size-3.5" />
			</Button>
		</div>
	);
}
