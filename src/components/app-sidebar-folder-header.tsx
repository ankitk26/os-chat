import { FolderIcon, PlusIcon } from "lucide-react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import { Button } from "./ui/button";
import { SidebarGroupLabel } from "./ui/sidebar";

export default function AppSidebarFolderHeader() {
	const setIsCreateModalOpen = useFolderActionStore(
		(store) => store.setIsCreateModalOpen,
	);

	return (
		<SidebarGroupLabel className="flex items-center justify-between gap-2 text-sm">
			<div className="flex items-center gap-2">
				<FolderIcon className="size-4" />
				Folders
			</div>
			<Button
				className="size-7 rounded"
				onClick={() => setIsCreateModalOpen(true)}
				size="icon"
				variant="ghost"
			>
				<PlusIcon />
			</Button>
		</SidebarGroupLabel>
	);
}
