import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import * as React from "react";
import { AppSidebar } from "~/components/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "~/components/ui/sidebar";
import { authQueryOptions } from "~/queries/auth-query";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context }) => {
		const authUser = await context.queryClient.fetchQuery(authQueryOptions);
		if (!authUser) {
			throw redirect({ to: "/login" });
		}
		return { authUser };
	},
	component: RouteComponent,
});

function FloatingSidebarTrigger() {
	const { state } = useSidebar();
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		if (state === "collapsed") {
			// Delay showing the trigger until sidebar animation completes
			const timer = setTimeout(() => setIsVisible(true), 200);
			return () => clearTimeout(timer);
		} else {
			setIsVisible(false);
		}
	}, [state]);

	if (state === "expanded" || !isVisible) {
		return null;
	}

	return (
		<div className="absolute top-2 left-2 z-50">
			<SidebarTrigger className="h-8 w-8" />
		</div>
	);
}

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<FloatingSidebarTrigger />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
