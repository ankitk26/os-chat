import { Link } from "@tanstack/react-router";
import SidebarChatItem from "./sidebar-chat-item";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarContent } from "./ui/sidebar";

export default function AppSidebarContent() {
  return (
    <SidebarContent className="flex flex-col items-stretch h-full px-4 pt-2 overflow-y-hidden">
      <Link to="/">
        <Button className="w-full">New Chat</Button>
      </Link>
      <ScrollArea className="h-full mt-4 grow">
        <div className="flex flex-col h-full gap-2 mb-4">
          {Array.from({ length: 30 }).map((_, index) => (
            <SidebarChatItem key={index} />
          ))}
        </div>
      </ScrollArea>
    </SidebarContent>
  );
}
