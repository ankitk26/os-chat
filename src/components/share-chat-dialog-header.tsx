import { ShareNetwork } from "@phosphor-icons/react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export default function ShareChatDialogHeader() {
	return (
		<DialogHeader className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
					<ShareNetwork className="text-primary h-5 w-5" />
				</div>
				<div>
					<DialogTitle className="text-left">Share Chat</DialogTitle>
					<DialogDescription className="text-left">
						Share this conversation with others
					</DialogDescription>
				</div>
			</div>
		</DialogHeader>
	);
}
