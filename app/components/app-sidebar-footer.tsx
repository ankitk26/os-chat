import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { SidebarFooter } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { Link } from "@tanstack/react-router";

export default function AppSidebarFooter() {
  const { isPending, data: user } = authClient.useSession();

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
    <SidebarFooter>
      <Link
        to="/settings"
        className="flex items-center justify-start gap-2 px-4 py-2 m-4 rounded cursor-pointer hover:bg-secondary"
      >
        <Avatar>
          <AvatarImage src={user?.user.image || ""} alt={user?.user.name[0]} />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <h3>{user?.user.name}</h3>
      </Link>
    </SidebarFooter>
  );
}
