import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
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

	if (state === "expanded") {
		return null;
	}

	return (
		<div className="absolute top-2 left-2 z-50">
			<SidebarTrigger className="bg-background h-8 w-8 rounded-lg border shadow-sm" />
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
