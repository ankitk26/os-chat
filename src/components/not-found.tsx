import { Link } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";
import { useSharedChatContext } from "~/providers/chat-provider";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

export default function NotFound() {
	const { clearChat } = useSharedChatContext();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
			<div className="absolute top-4 right-4">
				<ThemeToggler />
			</div>

			<Card className="w-full max-w-md text-center shadow-xl">
				<CardContent className="flex flex-col items-center gap-6 p-10">
					<h1 className="text-primary text-7xl font-extrabold tracking-tight">
						404
					</h1>

					<Separator className="my-2 w-1/2" />

					<p className="text-muted-foreground">
						Oops! The page you are looking for doesn’t exist or was moved.
					</p>

					<div className="mt-4 flex flex-wrap justify-center">
						<Button asChild>
							<Link
								className="flex items-center"
								onClick={() => clearChat()}
								to="/"
							>
								<HomeIcon className="h-4 w-4" />
								Go Home
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
