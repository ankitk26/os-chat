import {
	DotsThreeIcon,
	DownloadIcon,
	ShareNetworkIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import DeleteImageDialog from "./delete-image-dialog";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
	handleDownload: () => void;
	handleShare: () => void;
	side?: "left" | "right";
	storageId?: Id<"_storage">;
};

export default function GeneratedImageViewerMobileActions(props: Props) {
	const isMobile = useIsMobile();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const alignmentClass =
		props.side === "left" ? "justify-start" : "justify-end";
	const menuAlign = props.side === "left" ? "start" : "end";

	if (!isMobile) {
		return null;
	}

	return (
		<>
			<div className={`mt-1 flex lg:hidden ${alignmentClass}`}>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-0"
							>
								<DotsThreeIcon className="h-5 w-5" />
							</Button>
						}
					/>
					<DropdownMenuContent align={menuAlign}>
						<DropdownMenuItem onClick={props.handleDownload}>
							<DownloadIcon className="mr-2 h-4 w-4" />
							Download
						</DropdownMenuItem>
						<DropdownMenuItem onClick={props.handleShare}>
							<ShareNetworkIcon className="mr-2 h-4 w-4" />
							Copy link
						</DropdownMenuItem>
						{props.storageId ? (
							<DropdownMenuItem
								variant="destructive"
								onClick={() => setIsDeleteDialogOpen(true)}
							>
								<TrashIcon className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{props.storageId ? (
				<DeleteImageDialog
					storageId={props.storageId}
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
				/>
			) : null}
		</>
	);
}
