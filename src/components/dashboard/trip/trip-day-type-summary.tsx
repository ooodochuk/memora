"use client";

import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import type { TripEventWithRelations } from "@/types";
import { eventTypeIcons } from "@/lib/event-types";
import { eventTypeStyles } from "@/lib/design-system/tokens";
import {
 countEventsByType,
 countPhotosInDay,
 EVENT_SUMMARY_TYPE_ORDER,
} from "@/lib/trip-timeline/day-summary";
import { resolveEventDisplayLabel } from "@/lib/event-display";
import { cn } from "@/lib/utils";

interface TripDayTypeSummaryProps {
 events: TripEventWithRelations[];
 className?: string;
}

export function TripDayTypeSummary({
 events,
 className,
}: TripDayTypeSummaryProps) {
 const t = useTranslations("event.types");
 const tMeals = useTranslations("event.mealTypes");
 const tDetail = useTranslations("dashboard.pages.tripDetail");
 const counts = countEventsByType(events);
 const entries = EVENT_SUMMARY_TYPE_ORDER.filter(
 (type) => (counts[type] ?? 0) > 0,
 );
 const photoCount = countPhotosInDay(events);

 if (entries.length === 0 && photoCount === 0) return null;

 return (
 <div
 className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", className)}
 aria-label={tDetail("daySummaryLabel")}
 >
 {entries.map((type) => {
 const Icon = eventTypeIcons[type];
 const colors = eventTypeStyles(type);
 const count = counts[type] ?? 0;
 const sampleEvent = events.find((event) => event.type === type);
 const label = resolveEventDisplayLabel(
 {
 type,
 mealType: sampleEvent?.mealType,
 placeName: sampleEvent?.place?.name,
 },
 t,
 tMeals,
 );

 return (
 <span
 key={type}
 className="inline-flex items-center gap-1 text-xs text-muted-foreground"
 title={`${label}: ${count}`}
 >
 <span
 className="inline-flex size-6 items-center justify-center rounded-full"
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
 </span>
 <span className="tabular-nums font-medium text-muted-foreground">
 {count}
 </span>
 </span>
 );
 })}

 {photoCount > 0 && (
 <span
 className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
 title={tDetail("photoCount", { count: photoCount })}
 >
 <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground/8 text-muted-foreground">
 <Camera className="size-3.5" strokeWidth={1.75} aria-hidden />
 </span>
 <span className="tabular-nums font-medium text-muted-foreground">
 {photoCount}
 </span>
 </span>
 )}
 </div>
 );
}
