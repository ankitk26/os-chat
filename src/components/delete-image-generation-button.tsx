import { TrashIcon } from "@phosphor-icons/react";
import { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import DeleteImageDialog from "./delete-image-dialog";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	storageId: Id<"_storage">;
};

export default function DeleteImageGenerationButton({ storageId }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-white hover:bg-white/20 hover:backdrop-blur-sm"
							onClick={() => setIsOpen(true)}
						>
							<TrashIcon className="h-4 w-4" />
						</Button>
					}
				/>
				<TooltipContent side="bottom">Delete</TooltipContent>
			</Tooltip>

			<DeleteImageDialog
				storageId={storageId}
				open={isOpen}
				onOpenChange={setIsOpen}
			/>
		</>
	);
}
