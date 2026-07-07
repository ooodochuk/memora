"use client";

import { CoverImage } from "@/components/design-system/cover-image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
 Calendar,
 CalendarDays,
 Camera,
 Cloud,
 List,
 MapPin,
} from "lucide-react";
import type { Trip } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDateRange } from "@/lib/format";
import { JournalCard } from "@/components/design-system/journal-card";
import {
 StatusBadge,
 VisibilityBadge,
} from "@/components/design-system/status-badge";
import { cn } from "@/lib/utils";

/** Photo-dominant card — fixed editorial ratio for perfect grid alignment */
const COVER_ASPECT = "aspect-[4/5]";

export interface TripGalleryCardProps {
 trip: Trip;
 href: string;
 cloudLinkCount: number;
 showManagementBadges?: boolean;
 className?: string;
}

export function TripGalleryCard({
 trip,
 href,
 cloudLinkCount,
 showManagementBadges = false,
 className,
}: TripGalleryCardProps) {
 const t = useTranslations("dashboard.pages.trips");
 const locale = useLocale() as AppLocale;

 const stats = [
   { icon: CalendarDays, value: trip.stats.dayCount, label: t("stats.days") },
   { icon: List, value: trip.stats.eventCount, label: t("stats.events") },
   { icon: Camera, value: trip.stats.photoCount, label: t("stats.photos") },
   ...(cloudLinkCount > 0
     ? [{ icon: Cloud, value: cloudLinkCount, label: t("stats.cloudLinks") }]
     : []),
 ].filter((stat) => stat.value > 0);

 return (
 <Link href={href} className={cn("group block h-full", className)}>
 <JournalCard hover variant="photo" className="relative flex h-full flex-col">
 <div
 className={cn(
 "relative w-full shrink-0 overflow-hidden rounded-2xl",
 COVER_ASPECT,
 )}
 >
 <CoverImage
 src={trip.coverImageUrl}
 alt={trip.title}
 className="absolute inset-0 h-full w-full"
 sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
 imageClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
 />
 <div className="photo-vignette absolute inset-0" />
 <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

 {showManagementBadges ? (
 <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5">
 <StatusBadge status={trip.status} />
 <VisibilityBadge visibility={trip.visibility} />
 </div>
 ) : (
 trip.status !== "published" && (
 <div className="absolute top-3 left-3">
 <StatusBadge status={trip.status} />
 </div>
 )
 )}

 <div className="absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5">
 <div className="space-y-1.5">
 <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
 <MapPin className="size-3.5 shrink-0 text-primary/90" />
 <span className="truncate font-medium">{trip.country}</span>
 <span className="text-muted-foreground/60">·</span>
 <span className="truncate">{trip.region}</span>
 </div>
 <h3 className="line-clamp-2 font-heading text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
 {trip.title}
 </h3>
 <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
 {trip.description}
 </p>
 </div>

 <div className="flex items-center justify-between gap-3">
 <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
 <Calendar className="size-3.5 text-primary/80" />
 {formatDateRange(trip.startDate, trip.endDate, locale)}
 </span>
 <div className="hidden items-center gap-2 sm:flex">
 {stats.map(({ icon: Icon, value, label }) => (
 <span
 key={label}
 title={label}
 className="inline-flex items-center gap-1 rounded-full bg-foreground/8 px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground"
 >
 <Icon className="size-3 text-primary/80" strokeWidth={1.75} />
 {value}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 </JournalCard>
 </Link>
 );
}
