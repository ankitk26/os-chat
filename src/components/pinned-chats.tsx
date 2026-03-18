import { Suspense } from "react";
import PinnedChatsList from "./pinned-chats-list";

export default function PinnedChats() {
	return (
		<Suspense fallback={null}>
			<PinnedChatsList />
		</Suspense>
	);
}
