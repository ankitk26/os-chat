import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { authClient } from "~/lib/auth-client";
import { getToken } from "~/lib/auth-server";
import { cn } from "~/lib/utils";
import { ChatProvider } from "~/providers/chat-provider";
import { useAppearanceStore } from "~/stores/appearance-store";
import appCss from "~/styles.css?url";

// Get auth information for SSR using available cookies
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken();
});

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	convexQueryClient: ConvexQueryClient;
}>()({
	beforeLoad: async (ctx) => {
		const token = await getAuth();

		// all queries, mutations and actions through TanStack Query will be
		// authenticated during SSR if we have a valid token
		if (token) {
			// During SSR only (the only time serverHttpClient exists),
			// set the auth token to make HTTP queries with.
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}

		return {
			isAuthenticated: !!token,
			token,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "os-chat",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
		],
		links: [
			// Preload critical styles early to reduce FOUC
			{
				rel: "preload",
				href: appCss,
				as: "style",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	const context = useRouteContext({ from: Route.id });
	return (
		<ConvexBetterAuthProvider
			client={context.convexQueryClient.convexClient}
			authClient={authClient}
			initialToken={context.token}
		>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</ConvexBetterAuthProvider>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	const enableAllMono = useAppearanceStore((store) => store.enableAllMono);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className={cn("overflow-hidden", enableAllMono ? "font-mono" : "")}>
				<NextThemesProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<ChatProvider>
						<div>{children}</div>
						<Toaster duration={800} style={{ fontFamily: "inherit" }} />
						<ReactQueryDevtools />
						<Scripts />
					</ChatProvider>
				</NextThemesProvider>
			</body>
		</html>
	);
}
