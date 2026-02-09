import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
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
    (store) => store.setSelectedFolder
  );
  const setIsDeleteModalOpen = useFolderActionStore(
    (store) => store.setIsDeleteModalOpen
  );
  const setIsRenameModalOpen = useFolderActionStore(
    (store) => store.setIsRenameModalOpen
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-7 shrink-0 rounded-sm bg-secondary text-sidebar-foreground opacity-0 transition-opacity duration-200 hover:bg-sidebar group-hover/folders:opacity-100"
          size="icon"
        >
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFolder(folder);
            setIsRenameModalOpen(true);
          }}
        >
          <EditIcon />
          <span className="leading-0">Rename</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFolder(folder);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2Icon />
          <span className="leading-0">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
