import { Pencil, DotsThreeVertical, Trash } from "@phosphor-icons/react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import type { SidebarFolder } from "~/types";
import { Button } from "./ui/button";
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
					<Button
						size="icon-xs"
						variant="ghost"
						className="h-full w-full"
						onClick={(e) => e.stopPropagation()}
					>
						<DotsThreeVertical className="size-4 md:size-3" />
					</Button>
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
					<Pencil className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						setSelectedFolder(folder);
						setIsDeleteModalOpen(true);
					}}
				>
					<Trash className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
