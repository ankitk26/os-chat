import { Doc } from "convex/_generated/dataModel";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  folder: Doc<"folders">;
};

export default function SidebarFolderItem({ folder }: Props) {
  return (
    <div className="flex items-center justify-between pl-2 text-sm">
      <h4 className="line-clamp-1">{folder.title}</h4>
      <Button size="icon" variant="ghost">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
}
