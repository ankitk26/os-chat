import {
	ChatIcon,
	GithubLogoIcon,
	GoogleLogoIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
	const [loadingProvider, setLoadingProvider] = useState<
		"google" | "github" | null
	>(null);

	const handleLogin = async (provider: "google" | "github") => {
		setLoadingProvider(provider);
		try {
			await authClient.signIn.social({ provider });
		} catch {
			setLoadingProvider(null);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
			<div className="w-full max-w-md space-y-8">
				{/* Logo/Brand Section */}
				<div className="space-y-2 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
						<ChatIcon className="h-6 w-6 text-primary-foreground" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">baychat</h1>
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
							disabled={loadingProvider === "github"}
							onClick={() => handleLogin("github")}
						>
							{loadingProvider === "github" ? (
								<SpinnerIcon className="size-4 animate-spin" />
							) : (
								<GithubLogoIcon className="size-4" />
							)}
							{loadingProvider === "github"
								? "Signing in..."
								: "Continue with GitHub"}
						</Button>
						<Button
							className="h-9 w-full gap-2"
							disabled={loadingProvider === "google"}
							onClick={() => handleLogin("google")}
						>
							{loadingProvider === "google" ? (
								<SpinnerIcon className="size-4 animate-spin" />
							) : (
								<GoogleLogoIcon className="size-4" />
							)}
							{loadingProvider === "google"
								? "Signing in..."
								: "Continue with Google"}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
