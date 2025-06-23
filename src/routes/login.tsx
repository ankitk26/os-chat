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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <MessageSquareIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">os-chat</h1>
          <p className="text-muted-foreground">
            Your intelligent conversation companion
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to continue your conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={async () => {
                setIsLoading(true);
                try {
                  await authClient.signIn.social({ provider: "github" });
                } catch (error) {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full h-11"
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
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
