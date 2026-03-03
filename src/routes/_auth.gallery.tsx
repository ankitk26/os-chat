import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/gallery")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_auth/gallery"!</div>;
}
