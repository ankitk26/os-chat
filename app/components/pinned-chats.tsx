import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { PinIcon } from "lucide-react";
import { authQueryOptions } from "~/queries/auth";
import SidebarChats from "./sidebar-chats";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function PinnedChats() {
  const { data: authData } = useQuery(authQueryOptions);
  const { data: chatsData, isPending } = useQuery(
    convexQuery(api.chats.getPinnedChats, {
      sessionToken: authData?.session.token ?? "",
    })
  );

  if (!isPending && chatsData?.length === 0) {
    return null;
  }

  return (
    <>
      <section>
        <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
          <PinIcon className="size-4" />
          <h3>Pinned chats</h3>
        </div>

        {isPending ? (
          <div className="flex flex-col gap-2 mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={"app_sidebar_pinned_chat_loading_" + index}
                className="h-6"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            <SidebarChats pin={true} />
          </div>
        )}
      </section>
      <Separator />
    </>
  );
}
