import { Skeleton } from "~/components/ui/skeleton";

export default function UserMessageSkeleton() {
  return (
    <div className="flex items-end justify-end mb-2">
      <div className="rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-card p-3 max-w-[75%]">
        <Skeleton className="w-[200px] h-[20px]" />
        <Skeleton className="w-[250px] h-[20px] mt-2" />
        <Skeleton className="w-[150px] h-[20px] mt-2" />
      </div>
    </div>
  );
}
