import { ChevronDownIcon, ChevronRightIcon, NewspaperIcon } from "lucide-react";

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
				<ChevronDownIcon className="size-4" />
			) : (
				<ChevronRightIcon className="size-4" />
			)}
			<div className="text-muted-foreground flex items-center gap-2 font-mono text-sm select-none">
				<NewspaperIcon className="size-4" />
				Sources
			</div>
		</div>
	);
}
