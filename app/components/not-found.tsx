import { Link } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 p-6">
      <div className="absolute right-4 top-4">
        <ThemeToggler />
      </div>

      <Card className="w-full max-w-md text-center shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 p-10">
          <h1 className="font-extrabold tracking-tight text-7xl text-primary">
            404
          </h1>

          <Separator className="w-1/2 my-2" />

          <p className="text-muted-foreground">
            Oops! The page you are looking for doesn’t exist or was moved.
          </p>

          <div className="flex flex-wrap justify-center mt-4">
            <Button asChild>
              <Link to="/" className="flex items-center">
                <HomeIcon className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
