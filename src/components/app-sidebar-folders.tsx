import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { FolderIcon, PlusIcon } from "lucide-react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { useFolderActionStore } from "~/stores/folder-actions-store";
import AppSidebarFolderItem from "./app-sidebar-folder-item";
import DeleteFolderDialog from "./delete-folder-dialog";
import RenameFolderDialog from "./rename-folder-dialog";
import { Button } from "./ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function AppSidebarFolders() {
  const { auth } = useRouteContext({ strict: false });
  const { data: folders, isPending } = useQuery(
    convexQuery(api.folders.getFoldersWithChats, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  const setIsCreateModalOpen = useFolderActionStore(
    (store) => store.setIsCreateModalOpen
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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

      <SidebarMenu className="mt-2">
        {isPending && (
          <SidebarMenu>
            {Array.from({ length: 4 }).map(() => (
              <SidebarMenuItem key={generateRandomUUID()}>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
        {!isPending && folders && folders.length === 0 && (
          <small className="px-2 text-muted-foreground">No folders</small>
        )}

        {!isPending &&
          folders &&
          folders.length > 0 &&
          folders.map((folder) => (
            <AppSidebarFolderItem folder={folder} key={folder._id} />
          ))}
      </SidebarMenu>

      <DeleteFolderDialog />
      <RenameFolderDialog />
    </SidebarGroup>
  );
}
