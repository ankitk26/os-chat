import { FolderIcon, PlusIcon } from "@phosphor-icons/react";
import { folderActionStoreActions } from "~/stores/folder-actions-store";
import { Button } from "./ui/button";

export default function AppSidebarFolderHeader() {
	return (
		<div className="flex items-center justify-between px-2 py-1.5">
			<div className="flex items-center">
				<FolderIcon className="mr-2 size-4 text-sidebar-foreground/60" />
				<span className="text-xs font-normal text-sidebar-foreground/50">
					Folders
				</span>
			</div>
			<Button
				onClick={() => folderActionStoreActions.setIsCreateModalOpen(true)}
				size="icon"
				variant="ghost"
				className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
				title="Add Folder"
			>
				<PlusIcon className="size-3.5" />
			</Button>
		</div>
	);
}
