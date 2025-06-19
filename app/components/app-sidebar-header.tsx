import { Link } from "@tanstack/react-router";
import { PanelLeftIcon } from "lucide-react";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import { SidebarHeader } from "./ui/sidebar";

export default function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center px-4 py-2">
        <Button size="icon" variant="ghost">
          <PanelLeftIcon />
        </Button>
        <div className="flex justify-center grow">
          <Link
            to="/"
            className="text-lg font-medium tracking-wide text-center w-fit"
          >
            <h3>os-chat</h3>
          </Link>
        </div>
        <ThemeToggler />
      </div>
    </SidebarHeader>
  );
}
