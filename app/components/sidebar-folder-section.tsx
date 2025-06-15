import { FolderIcon } from "lucide-react";
import { Suspense } from "react";
import AddFolderButton from "./add-folder-button";
import SidebarFolders from "./sidebar-folders";
import { Skeleton } from "./ui/skeleton";

export default function SidebarFolderSection() {
  return (
    <section>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2 px-2">
          <FolderIcon className="size-4" />
          <h3>Folders</h3>
        </div>
        <AddFolderButton />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col h-full gap-2 mt-4 grow">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={"app_sidebar_folder_loading_" + index}
                className="w-full h-6"
              />
            ))}
          </div>
        }
      >
        <div className="flex flex-col gap-2 mt-3">
          <SidebarFolders />
        </div>
      </Suspense>
    </section>
  );
}
