import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import GithubIcon from "~/components/github-icon";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <MessageSquareIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight">os-chat</h1>
          <p className="text-muted-foreground">
            Your intelligent conversation companion
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to continue your conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="h-11 w-full"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await authClient.signIn.social({ provider: "github" });
                } catch {
                  setIsLoading(false);
                }
              }}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <GithubIcon />
              )}
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
