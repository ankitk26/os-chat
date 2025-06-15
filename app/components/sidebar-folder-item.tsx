import { Doc } from "convex/_generated/dataModel";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  folder: Doc<"folders">;
};

export default function SidebarFolderItem({ folder }: Props) {
  return (
    <Button variant="ghost" className="items-center justify-start">
      <ChevronRightIcon />
      {folder.title}
    </Button>
  );
}
