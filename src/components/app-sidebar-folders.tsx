import { Suspense } from "react";
import AppSidebarFolderHeader from "./app-sidebar-folder-header";
import AppSidebarFolderSkeleton from "./app-sidebar-folder-skeleton";
import AppSidebarFoldersList from "./app-sidebar-folders-list";
import DeleteFolderDialog from "./delete-folder-dialog";
import RenameFolderDialog from "./rename-folder-dialog";
import { SidebarGroup, SidebarMenu } from "./ui/sidebar";

export default function AppSidebarFolders() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <AppSidebarFolderHeader />

      <SidebarMenu className="mt-2">
        <Suspense fallback={<AppSidebarFolderSkeleton />}>
          <AppSidebarFoldersList />
        </Suspense>
      </SidebarMenu>

      <DeleteFolderDialog />
      <RenameFolderDialog />
    </SidebarGroup>
  );
}
