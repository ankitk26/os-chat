import { Link, useRouteContext } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function AppSidebarFooter() {
  const { auth } = useRouteContext({ strict: false });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to="/settings">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent cursor-pointer data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage
                src={auth?.user.image || ""}
                alt={auth?.user.name[0]}
              />
              <AvatarFallback className="rounded-lg">
                {auth?.user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((namePart) => namePart.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{auth?.user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {auth?.user.email}
              </span>
            </div>
            <SettingsIcon />
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
