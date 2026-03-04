import {
	DotsThreeIcon,
	DownloadIcon,
	ShareNetworkIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
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
	image: FunctionReturnType<typeof api.imageGenerations.getAll>[0];
	handleDownload: () => void;
	handleShare: () => void;
};

export default function GalleryImageItemMobileActions(props: Props) {
	const isMobile = useIsMobile();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	if (!isMobile) {
		return null;
	}

	return (
		<>
			<div className="mt-1 flex justify-end lg:hidden">
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
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={props.handleDownload}>
							<DownloadIcon className="mr-2 h-4 w-4" />
							Download
						</DropdownMenuItem>
						<DropdownMenuItem onClick={props.handleShare}>
							<ShareNetworkIcon className="mr-2 h-4 w-4" />
							Copy link
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => setIsDeleteDialogOpen(true)}
						>
							<TrashIcon className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DeleteImageDialog
				storageId={props.image.storageId}
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			/>
		</>
	);
}
