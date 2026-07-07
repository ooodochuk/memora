import { getTranslations } from "next-intl/server";
import type { ProfileStats } from "@/types";
import { cn } from "@/lib/utils";

interface ProfileStatsBarProps {
 stats: ProfileStats;
 className?: string;
}

export async function ProfileStatsBar({
 stats,
 className,
}: ProfileStatsBarProps) {
 const t = await getTranslations("profile");

 return (
 <div
 className={cn(
 "inline-flex rounded-2xl border border-border bg-card px-6 py-4",
 className,
 )}
 >
 <div className="space-y-1">
 <p className="font-heading text-2xl font-medium tabular-nums">
 {stats.tripCount.toLocaleString()}
 </p>
 <p className="text-sm text-muted-foreground">{t("trips")}</p>
 </div>
 </div>
 );
}
