import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/design-system/page-container";

export function SkeletonText({
 className,
 lines = 1,
}: {
 className?: string;
 lines?: number;
}) {
 return (
 <div className={cn("space-y-2", className)}>
 {Array.from({ length: lines }).map((_, i) => (
 <Skeleton
 key={i}
 className={cn("h-3.5 rounded-md", i === lines - 1 && lines > 1 && "w-4/5")}
 />
 ))}
 </div>
 );
}

export function TripCardSkeleton({ className }: { className?: string }) {
 return (
 <div
 className={cn(
 "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
 className,
 )}
 >
 <Skeleton className="aspect-[16/10] w-full rounded-none" />
 <div className="space-y-3 p-5 sm:p-6">
 <Skeleton className="h-3 w-24 rounded-md" />
 <Skeleton className="h-6 w-3/4 rounded-md" />
 <SkeletonText lines={2} />
 <div className="flex gap-2 pt-1">
 <Skeleton className="h-5 w-16 rounded-full" />
 <Skeleton className="h-5 w-20 rounded-full" />
 </div>
 </div>
 </div>
 );
}

export function ProfileHeroSkeleton({ className }: { className?: string }) {
 return (
 <div className={cn("space-y-0", className)}>
 <Skeleton className="h-48 w-full rounded-none sm:h-64 md:h-72" />
 <div className="relative px-5 sm:px-6 lg:px-10">
 <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
 <Skeleton className="size-24 rounded-full border-4 border-background sm:size-28" />
 <div className="space-y-2 pb-1">
 <Skeleton className="h-7 w-48 rounded-md" />
 <Skeleton className="h-4 w-24 rounded-md" />
 <SkeletonText lines={2} className="max-w-md" />
 </div>
 </div>
 </div>
 </div>
 );
}

export function EventTimelineSkeleton({
 count = 3,
 className,
}: {
 count?: number;
 className?: string;
}) {
 return (
 <div className={cn("space-y-0", className)}>
 {Array.from({ length: count }).map((_, i) => (
 <div key={i} className="relative flex gap-3 pb-8 sm:gap-4">
 {i < count - 1 && (
 <div
 className="absolute top-10 left-5 bottom-0 w-px bg-border-border"
 aria-hidden
 />
 )}
 <Skeleton className="size-10 shrink-0 rounded-full" />
 <div className="min-w-0 flex-1 space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
 <div className="flex gap-2">
 <Skeleton className="h-5 w-16 rounded-full" />
 <Skeleton className="h-4 w-12 rounded-md" />
 </div>
 <Skeleton className="h-5 w-2/3 rounded-md" />
 <SkeletonText lines={2} />
 </div>
 </div>
 ))}
 </div>
 );
}

export function TripGridSkeleton({
 count = 4,
 className,
}: {
 count?: number;
 className?: string;
}) {
 return (
 <div className={cn("grid gap-6 sm:grid-cols-2", className)}>
 {Array.from({ length: count }).map((_, i) => (
 <TripCardSkeleton key={i} />
 ))}
 </div>
 );
}

export function DashboardHomeSkeleton() {
 return (
 <PageContainer spacing="md" className="space-y-12 sm:space-y-14">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex items-center gap-4">
 <Skeleton className="size-14 rounded-full sm:size-16" />
 <div className="space-y-2">
 <Skeleton className="h-7 w-44 rounded-md sm:w-52" />
 <Skeleton className="h-4 w-56 rounded-md sm:w-72" />
 </div>
 </div>
 </div>

 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
 {Array.from({ length: 4 }).map((_, i) => (
 <Skeleton key={i} className="h-24 rounded-2xl sm:h-28" />
 ))}
 </div>

 <div className="space-y-4">
 <Skeleton className="h-6 w-36 rounded-md" />
 <TripGridSkeleton count={2} className="lg:grid-cols-2" />
 </div>
 </PageContainer>
 );
}

export function DashboardTripsPageSkeleton() {
 return (
 <PageContainer spacing="md" className="space-y-8">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div className="space-y-2">
 <Skeleton className="h-8 w-28 rounded-md" />
 <Skeleton className="h-4 w-64 max-w-full rounded-md" />
 </div>
 <Skeleton className="h-9 w-32 rounded-xl" />
 </div>
 <div className="flex flex-wrap gap-2">
 {Array.from({ length: 4 }).map((_, i) => (
 <Skeleton key={i} className="h-9 w-24 rounded-xl" />
 ))}
 </div>
 <TripGridSkeleton count={6} className="sm:grid-cols-2 xl:grid-cols-3" />
 </PageContainer>
 );
}
