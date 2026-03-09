import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
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
import { TooltipProvider } from "~/components/ui/tooltip";
import { authClient } from "~/lib/auth-client";
import { getToken } from "~/lib/auth-server";
import { cn } from "~/lib/utils";
import { ChatProvider } from "~/providers/chat-provider";
import { getAppFont } from "~/server-fns/app-font";
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

		const appFont = await getAppFont();

		return {
			isAuthenticated: !!token,
			token,
			appFont,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content:
					"width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
			},
			{
				title: "baychat",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "baychat",
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
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-96x96.png",
				sizes: "96x96",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{
				rel: "shortcut icon",
				href: "/favicon.ico",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
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
	const { appFont } = Route.useRouteContext();

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className={cn("overflow-hidden", appFont)}>
				<NextThemesProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<TooltipProvider delay={0}>
						<ChatProvider>
							<div>{children}</div>
							<Toaster duration={800} style={{ fontFamily: "inherit" }} />
							{/*<ReactQueryDevtools />*/}
							<Scripts />
						</ChatProvider>
					</TooltipProvider>
				</NextThemesProvider>
			</body>
		</html>
	);
}
