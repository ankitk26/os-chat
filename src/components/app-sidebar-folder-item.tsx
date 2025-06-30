import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import SidebarChatItem from "./sidebar-chat-item";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AppSidebarFolderItem(props: {
  folder: FunctionReturnType<typeof api.folders.getFoldersWithChats>[0];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showChats, setShowChats] = useState(false);

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
    <>
      <div
        className="flex items-center justify-between py-2 px-2 text-sm rounded-md cursor-pointer hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowChats((prev) => !prev)}
      >
        <Tooltip>
          <TooltipTrigger>
            {props.folder.chats.length > 0 && (
              <>
                {showChats ? (
                  <ChevronDownIcon className="size-4 cursor-pointer mr-2 text-muted-foreground hover:text-secondary-foreground" />
                ) : (
                  <ChevronRightIcon className="size-4 cursor-pointer mr-2 text-muted-foreground hover:text-secondary-foreground" />
                )}
              </>
            )}
          </TooltipTrigger>
          <TooltipContent>View chats</TooltipContent>
        </Tooltip>
        <h4
          className="line-clamp-1 w-full select-none"
          title={props.folder.title}
        >
          {props.folder.title}
        </h4>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className={`size-7 rounded-sm bg-secondary hover:bg-sidebar text-sidebar-foreground flex-shrink-0 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFolder(props.folder);
                setIsRenameModalOpen(true);
              }}
            >
              <EditIcon />
              <span className="leading-0">Rename</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFolder(props.folder);
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2Icon />
              <span className="leading-0">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {props.folder.chats.length > 0 && showChats && (
        <div className="ml-4 space-y-1">
          {props.folder.chats.map((chat) => (
            <SidebarChatItem key={chat._id} chat={chat} />
          ))}
        </div>
      )}
    </>
  );
}
