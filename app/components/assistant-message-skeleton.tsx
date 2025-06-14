import { Skeleton } from "./ui/skeleton";

export default function AssistantMessageSkeleton() {
  return (
    <div className="flex items-start mb-2">
      <div className="rounded-tr-lg rounded-tl-lg rounded-br-lg bg-card p-3 max-w-[75%]">
        <Skeleton className="w-[220px] h-[20px]" />
        <Skeleton className="w-[280px] h-[20px] mt-2" />
        <Skeleton className="w-[180px] h-[20px] mt-2" />
      </div>
    </div>
  );
}
