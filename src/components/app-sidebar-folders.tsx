import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense } from "react";
import AppSidebarFolderHeader from "./app-sidebar-folder-header";
import AppSidebarFolderItem from "./app-sidebar-folder-item";
import AppSidebarFolderSkeleton from "./app-sidebar-folder-skeleton";
import DeleteFolderDialog from "./delete-folder-dialog";
import RenameFolderDialog from "./rename-folder-dialog";
import { SidebarGroup, SidebarMenu } from "./ui/sidebar";

export default function AppSidebarFolders() {
  const { auth } = useRouteContext({ strict: false });

  const { data: folders } = useSuspenseQuery(
    convexQuery(api.folders.getFoldersWithChats, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <AppSidebarFolderHeader />

      <SidebarMenu className="mt-2">
        <Suspense fallback={<AppSidebarFolderSkeleton />}>
          {folders.length === 0 && (
            <small className="px-2 text-muted-foreground">No folders</small>
          )}
          {folders.length !== 0 &&
            folders.map((folder) => (
              <AppSidebarFolderItem folder={folder} key={folder._id} />
            ))}
        </Suspense>
      </SidebarMenu>

      <DeleteFolderDialog />
      <RenameFolderDialog />
    </SidebarGroup>
  );
}
