import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import SidebarChats from "./sidebar-chats";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarContent } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export default function AppSidebarContent() {
  return (
    <SidebarContent className="flex flex-col items-stretch h-full px-4 pt-2 overflow-y-hidden grow">
      <Link to="/">
        <Button className="w-full">New Chat</Button>
      </Link>
      <ScrollArea className="h-full mt-4 grow">
        <div className="flex flex-col h-full gap-2 mb-4">
          <Suspense
            fallback={
              <div className="flex flex-col h-full gap-2 mt-4 grow">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={"app_sidebar_chat_loading_" + index}
                    className="w-full h-10"
                  />
                ))}
              </div>
            }
          >
            <SidebarChats />
          </Suspense>
        </div>
      </ScrollArea>
    </SidebarContent>
  );
}
