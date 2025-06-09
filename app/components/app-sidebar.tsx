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
        <div className="flex items-center py-2 px-4">
          <Button size="icon" variant="ghost">
            <PanelLeftIcon />
          </Button>
          <h3 className="text-lg tracking-wide font-medium text-center flex-grow">
            os.chat
          </h3>
          <ThemeToggler />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex h-full overflow-y-hidden px-4 flex-col pt-2 items-stretch">
        <Link to="/">
          <Button className="w-full">New Chat</Button>
        </Link>
        <ScrollArea className="grow h-full mt-4">
          <div className="flex flex-col gap-2 h-full mb-4">
            {Array.from({ length: 30 }).map((_, index) => (
              <SidebarChatItem key={index} />
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex rounded cursor-pointer items-center gap-2 py-2 px-4 m-4 justify-start hover:bg-secondary">
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
