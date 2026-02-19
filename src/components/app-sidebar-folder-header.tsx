import { FolderIcon, PlusIcon } from "lucide-react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import { Button } from "./ui/button";

export default function AppSidebarFolderHeader() {
	const setIsCreateModalOpen = useFolderActionStore(
		(store) => store.setIsCreateModalOpen,
	);

	return (
		<div className="flex items-center justify-between px-2 py-1">
			<div className="flex items-center">
				<FolderIcon className="text-sidebar-foreground/70 mr-2 size-4" />
				<span className="text-sidebar-foreground/70 text-xs">Folders</span>
			</div>
			<Button
				onClick={() => setIsCreateModalOpen(true)}
				size="icon"
				variant="ghost"
				className="h-6 w-6 shrink-0"
				title="Add Folder"
			>
				<PlusIcon className="size-3.5" />
			</Button>
		</div>
	);
}
