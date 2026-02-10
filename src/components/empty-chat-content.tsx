import { useParams, useRouteContext } from "@tanstack/react-router";

export default function EmptyChatContent() {
	const { chatId } = useParams({ strict: false });

	if (chatId) {
		return null;
	}

	const { authUser } = useRouteContext({ from: "/_auth" });

	return (
		<div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-4 lg:px-0">
			<h2 className="mb-2 text-3xl font-semibold">
				Welcome {authUser?.name?.split(" ")[0]}
			</h2>
			<p>Start a conversation by typing a message below.</p>
		</div>
	);
}
