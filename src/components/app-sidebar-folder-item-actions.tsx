import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import type { SidebarFolder } from "~/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
	folder: SidebarFolder;
};

export default function AppSidebarFolderItemActions({ folder }: Props) {
	const setSelectedFolder = useFolderActionStore(
		(store) => store.setSelectedFolder,
	);
	const setIsDeleteModalOpen = useFolderActionStore(
		(store) => store.setIsDeleteModalOpen,
	);
	const setIsRenameModalOpen = useFolderActionStore(
		(store) => store.setIsRenameModalOpen,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<div className="flex h-full w-full cursor-pointer items-center justify-center">
						<EllipsisVerticalIcon className="size-4" />
					</div>
				}
			/>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						setSelectedFolder(folder);
						setIsRenameModalOpen(true);
					}}
				>
					<EditIcon className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						setSelectedFolder(folder);
						setIsDeleteModalOpen(true);
					}}
				>
					<Trash2Icon className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
