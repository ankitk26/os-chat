import { CaretDown, CaretRight } from "@phosphor-icons/react";

type Props = {
	showChats: boolean;
	folderHasChats: boolean;
};

export default function AppSidebarFolderItemToggler(props: Props) {
	if (!props.folderHasChats) {
		return null;
	}

	return props.showChats ? (
		<CaretDown className="size-4 shrink-0" />
	) : (
		<CaretRight className="size-4 shrink-0" />
	);
}
