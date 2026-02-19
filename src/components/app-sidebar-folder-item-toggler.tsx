import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

type Props = {
	showChats: boolean;
	folderHasChats: boolean;
};

export default function AppSidebarFolderItemToggler(props: Props) {
	if (!props.folderHasChats) {
		return null;
	}

	return props.showChats ? (
		<ChevronDownIcon className="size-4 shrink-0" />
	) : (
		<ChevronRightIcon className="size-4 shrink-0" />
	);
}
