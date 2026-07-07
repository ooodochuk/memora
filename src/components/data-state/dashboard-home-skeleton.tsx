import { PageContainer } from "@/components/design-system/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { STAT_DASHBOARD_ITEM_CLASS, STAT_ROW_CLASS } from "@/lib/stats-layout";

export function DashboardHomeSkeleton() {
  return (
    <PageContainer spacing="md" className="space-y-12 sm:space-y-14" aria-hidden>
      <div className="surface-card space-y-4 rounded-xl border border-border/50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Skeleton className="size-16 rounded-full sm:size-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-64 max-w-full rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-3 w-24 rounded-md" />
        <ul className={cn(STAT_ROW_CLASS, "list-none p-0")}>
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className={STAT_DASHBOARD_ITEM_CLASS}>
              <Skeleton className="h-[88px] w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}
