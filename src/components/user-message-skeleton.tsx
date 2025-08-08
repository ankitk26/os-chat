import { Skeleton } from "~/components/ui/skeleton";

export default function UserMessageSkeleton() {
  return (
    <div className="mb-2 flex items-end justify-end">
      <div className="max-w-[75%] rounded-tl-lg rounded-tr-lg rounded-bl-lg p-3">
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="mt-2 h-[20px] w-[250px]" />
        <Skeleton className="mt-2 h-[20px] w-[150px]" />
      </div>
    </div>
  );
}
