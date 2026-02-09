import { Skeleton } from "./ui/skeleton";

export default function AssistantMessageSkeleton() {
	return (
		<div className="mb-2 flex items-start">
			<div className="max-w-[75%] rounded-tl-lg rounded-tr-lg rounded-br-lg p-3">
				<Skeleton className="h-[20px] w-[220px]" />
				<Skeleton className="mt-2 h-[20px] w-[280px]" />
				<Skeleton className="mt-2 h-[20px] w-[180px]" />
			</div>
		</div>
	);
}
