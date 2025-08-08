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
            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            size="lg"
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage
                alt={auth?.user.name[0]}
                src={auth?.user.image || ""}
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
              <span className="truncate text-muted-foreground text-xs">
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
