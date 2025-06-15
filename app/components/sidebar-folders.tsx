import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { authQueryOptions } from "~/queries/auth";
import SidebarFolderItem from "./sidebar-folder-item";

export default function SidebarFolders() {
  const { data: authData } = useSuspenseQuery(authQueryOptions);
  const { data: foldersData } = useSuspenseQuery(
    convexQuery(api.folders.getFolders, {
      sessionToken: authData?.session.token ?? "",
    })
  );

  if (foldersData.length === 0) {
    return <p className="text-sm text-muted-foreground">No folders</p>;
  }

  return foldersData.map((folder) => (
    <SidebarFolderItem key={folder._id} folder={folder} />
  ));
}
