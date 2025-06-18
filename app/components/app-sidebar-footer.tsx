import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { authQueryOptions } from "~/queries/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarFooter } from "./ui/sidebar";
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
    <SidebarFooter className="border-t border-border/50">
      <Link
        to="/settings"
        className="flex items-center justify-start gap-4 px-4 py-2 m-4 text-sm rounded cursor-pointer hover:bg-secondary"
      >
        <Avatar>
          <AvatarImage src={user?.user.image || ""} alt={user?.user.name[0]} />
          <AvatarFallback>
            {user?.user.name
              .split(" ")
              .slice(0, 2)
              .map((namePart) => namePart.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h3>{user?.user.name}</h3>
      </Link>
    </SidebarFooter>
  );
}
