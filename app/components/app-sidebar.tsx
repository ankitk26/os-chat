import { Link } from "@tanstack/react-router";
import { PanelLeftIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar";
import SidebarChatItem from "./sidebar-chat-item";
import { ThemeToggler } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <Button size="icon" variant="ghost">
            <PanelLeftIcon />
          </Button>
          <h3 className="flex-grow text-lg font-medium tracking-wide text-center">
            os.chat
          </h3>
          <ThemeToggler />
        </div>
      </SidebarHeader>

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

      <SidebarFooter>
        <div className="flex items-center justify-start gap-2 px-4 py-2 m-4 rounded cursor-pointer hover:bg-secondary">
          <Avatar>
            <AvatarImage src="https://t3.chat/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocLjfqiiKTi3qH1O5AaGYI3yO9-Ujcp_LinoQmDeVRR_i8NSa30%3Ds1280-c&w=384&q=75" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <h3>Ankit Kumar</h3>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
