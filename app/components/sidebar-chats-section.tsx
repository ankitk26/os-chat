import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";
import SidebarChats from "./sidebar-chats";
import { Skeleton } from "./ui/skeleton";

export default function SidebarChatsSection() {
  return (
    <section>
      <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
        <MessageSquareIcon className="size-4" />
        <h3>Chats</h3>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col gap-2 mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={"app_sidebar_chat_loading_" + index}
                className="h-6"
              />
            ))}
          </div>
        }
      >
        <div className="flex flex-col gap-2 mt-3">
          <SidebarChats />
        </div>
      </Suspense>
    </section>
  );
}
