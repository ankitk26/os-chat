import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import AppSidebarFolderItemActions from "./app-sidebar-folder-item-actions";
import AppSidebarFolderItemToggler from "./app-sidebar-folder-item-toggler";

type Props = {
  folder: FunctionReturnType<typeof api.folders.getFoldersWithChats>[0];
};

export default function AppSidebarFolderItem(props: Props) {
  const [showChats, setShowChats] = useState(false);

  return (
    <>
      <div
        className="group/folders flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground"
        onClick={() => setShowChats((prev) => !prev)}
      >
        {/* Show chats toggler */}
        <AppSidebarFolderItemToggler
          folderHasChats={props.folder.chats.length > 0}
          showChats={showChats}
        />

        {/* Folder title */}
        <h4
          className="line-clamp-1 w-full select-none"
          title={props.folder.title}
        >
          {props.folder.title}
        </h4>

        {/* Actions related to folder */}
        <AppSidebarFolderItemActions folder={props.folder} />
      </div>

      {/* Chats under the folder */}
      {props.folder.chats.length > 0 && showChats && (
        <div className="ml-4 space-y-1">
          {props.folder.chats.map((chat) => (
            <AppSidebarChatItem chat={chat} key={chat._id} />
          ))}
        </div>
      )}
    </>
  );
}
