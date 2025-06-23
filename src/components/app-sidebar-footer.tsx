import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";
import { authQueryOptions } from "~/queries/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export default function AppSidebarFooter() {
  const { isPending, data: user } = useQuery(authQueryOptions);

  if (isPending) {
    return (
      <SidebarFooter>
        <div className="flex items-center justify-start gap-2 px-4 py-2 m-4 rounded cursor-pointer hover:bg-secondary">
          <Skeleton className="rounded-full aspect-square size-10" />
          <Skeleton className="w-full h-4" />
        </div>
      </SidebarFooter>
    );
  }

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
                src={user?.user.image || ""}
                alt={user?.user.name[0]}
              />
              <AvatarFallback className="rounded-lg">
                {user?.user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((namePart) => namePart.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.user.email}
              </span>
            </div>
            <SettingsIcon />
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
