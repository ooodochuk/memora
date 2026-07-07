import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EquipmentGridSkeletonProps {
  count?: number;
  className?: string;
}

export function EquipmentGridSkeleton({
  count = 8,
  className,
}: EquipmentGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="surface-card space-y-2 rounded-xl border border-border/50 p-2 sm:p-2.5"
        >
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-2.5 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-2.5 w-3/4 rounded-md" />
        </div>
      ))}
    </div>
  );
}
