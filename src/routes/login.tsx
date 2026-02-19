import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon, MessageSquareIcon } from "lucide-react";
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

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({ provider: "github" });
		} catch {
			setIsLoading(false);
		}
	};

	return (
		<div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
			<div className="w-full max-w-md space-y-8">
				{/* Logo/Brand Section */}
				<div className="space-y-2 text-center">
					<div className="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
						<MessageSquareIcon className="text-primary-foreground h-6 w-6" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">os-chat</h1>
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
							className="h-9 w-full gap-2"
							disabled={isLoading}
							onClick={handleLogin}
						>
							{isLoading ? (
								<LoaderIcon className="size-4 animate-spin" />
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
