import {
	CaretDownIcon,
	CaretRightIcon,
	NewspaperIcon,
} from "@phosphor-icons/react";

type Props = {
	toggleSourcesDisplay: () => void;
	showSources: boolean;
};

export default function SourcesToggleButton(props: Props) {
	return (
		<div
			className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 select-none"
			onClick={props.toggleSourcesDisplay}
		>
			{props.showSources ? (
				<CaretDownIcon className="size-3" />
			) : (
				<CaretRightIcon className="size-3" />
			)}
			<div className="text-muted-foreground flex items-center gap-2 font-mono text-xs select-none">
				<NewspaperIcon className="size-3" />
				Sources
			</div>
		</div>
	);
}
