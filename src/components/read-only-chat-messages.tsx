import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Link2OffIcon } from "lucide-react";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ReadOnlyAssistantMessage from "./read-only-assistant-message";
import ReadOnlyUserMessage from "./read-only-user-message";
import { ScrollArea } from "./ui/scroll-area";
import UserMessageSkeleton from "./user-message-skeleton";

export default function ReadOnlyChatMessages() {
	const { chatId } = useParams({ from: "/share/$chatId" });

	const { data, isPending } = useQuery(
		convexQuery(api.messages.getSharedChatMessages, { sharedChatUuid: chatId }),
	);

	if (!(isPending || data)) {
		return (
			<div className="mx-auto flex h-svh max-w-md flex-col items-center justify-center px-4">
				<div className="space-y-4 text-center">
					<div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
						<Link2OffIcon className="text-muted-foreground h-8 w-8" />
					</div>
					<div className="space-y-2">
						<h1 className="text-xl font-semibold">Chat not available</h1>
						<p className="text-muted-foreground">
							This shared conversation is no longer available or has been made
							private.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex h-svh max-h-svh w-full flex-col">
			<div className="flex-1 overflow-hidden">
				<ScrollArea className="h-full w-full">
					<div className="mx-auto h-full w-full max-w-3xl">
						<div className="my-8 space-y-8 pb-32">
							<h2 className="-mt-3 text-center text-3xl font-semibold">
								{data?.parentChatTitle}
							</h2>

							{isPending ? (
								<>
									<UserMessageSkeleton />
									<AssistantMessageSkeleton />
								</>
							) : (
								data?.messages.map((message) => (
									<div className="flex flex-col" key={message._id}>
										{message.role === "user" ? (
											<ReadOnlyUserMessage message={message} />
										) : (
											<ReadOnlyAssistantMessage message={message} />
										)}
									</div>
								))
							)}
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
