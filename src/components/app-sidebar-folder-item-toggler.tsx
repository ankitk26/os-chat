import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";

type Props = {
	showChats: boolean;
	folderHasChats: boolean;
};

export default function AppSidebarFolderItemToggler(props: Props) {
	if (!props.folderHasChats) {
		return null;
	}

	return props.showChats ? (
		<CaretDownIcon className="size-4 shrink-0" />
	) : (
		<CaretRightIcon className="size-4 shrink-0" />
	);
}
