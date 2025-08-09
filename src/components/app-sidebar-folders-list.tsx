import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import AppSidebarFolderItem from "./app-sidebar-folder-item";

export default function AppSidebarFoldersList() {
  const { auth } = useRouteContext({ strict: false });

  const { data: folders } = useSuspenseQuery(
    convexQuery(api.folders.getFoldersWithChats, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  if (folders.length === 0) {
    return <small className="px-2 text-muted-foreground">No folders</small>;
  }

  return folders.map((folder) => (
    <AppSidebarFolderItem folder={folder} key={folder._id} />
  ));
}
