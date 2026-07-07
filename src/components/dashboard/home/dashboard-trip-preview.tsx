"use client";

import { CoverImage } from "@/components/design-system/cover-image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Trip } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { dashboardRoutes } from "@/constants/routes";
import { formatDateRange, getTripDuration } from "@/lib/format";
import { countEventsForTrip } from "@/lib/mock-data";
import { StatusBadge } from "@/components/design-system/status-badge";
import { Eyebrow, MetaText } from "@/components/design-system/typography";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface DashboardTripPreviewProps {
 trip: Trip;
}

export function DashboardTripPreview({ trip }: DashboardTripPreviewProps) {
 const t = useTranslations("trip");
 const tCommon = useTranslations("common");
 const locale = useLocale() as AppLocale;
 const duration = getTripDuration(trip.startDate, trip.endDate);
 const eventCount = countEventsForTrip(trip.id);

 return (
 <Link
 href={dashboardRoutes.trip(trip.id)}
 className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-border hover:shadow-md sm:flex-row"
 >
 <div className="relative aspect-[16/10] w-full shrink-0 sm:w-44 md:w-52">
 <CoverImage
 src={trip.coverImageUrl}
 alt={trip.title}
 className="h-full w-full"
 sizes="208px"
 imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
 />
 </div>
 <div className="flex flex-1 flex-col justify-center gap-2 p-5">
 {trip.status !== "published" && <StatusBadge status={trip.status} />}
 <Eyebrow variant="subtitle" className="line-clamp-1">
 {trip.subtitle}
 </Eyebrow>
 <h3 className="font-heading text-lg font-medium tracking-tight group-hover:text-primary sm:text-xl">
 {trip.title}
 </h3>
 <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
 <MetaText className="inline-flex items-center gap-1">
 <Calendar className="size-3" />
 {formatDateRange(trip.startDate, trip.endDate, locale)}
 </MetaText>
 <MetaText>{t("duration", { count: duration })}</MetaText>
 <MetaText>{tCommon("events", { count: eventCount })}</MetaText>
 </div>
 <Badge variant="outline" size="sm" className="w-fit">
 {trip.country}
 </Badge>
 </div>
 </Link>
 );
}
