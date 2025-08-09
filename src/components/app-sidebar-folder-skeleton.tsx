import { generateRandomUUID } from "~/lib/generate-random-uuid";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function AppSidebarFolderSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 4 }).map(() => (
        <SidebarMenuItem key={generateRandomUUID()}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
