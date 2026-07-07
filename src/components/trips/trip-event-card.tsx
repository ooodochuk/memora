"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Profile, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { dashboardRoutes } from "@/constants/routes";
import { formatTime } from "@/lib/format";
import { resolveMomentLocationLabel } from "@/lib/event-display";
import { isMemoraUploadedUrl } from "@/lib/media-url";
import {
 EventTypeBadge,
 EventTypeIcon,
 useEventDisplayLabel,
} from "@/components/design-system/event-type-badge";
import {
 Avatar,
 AvatarFallback,
 AvatarGroup,
 AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { CloudLinkList } from "@/components/cloud-links";
import { cn } from "@/lib/utils";

const PHOTO_PREVIEW_LIMIT = 3;

interface TripEventCardProps {
 event: TripEventWithRelations;
 locale: AppLocale;
 isLast?: boolean;
 showActions?: boolean;
 className?: string;
}

function profileInitials(profile: Profile): string {
 return profile.displayName
 .split(" ")
 .map((part) => part[0])
 .join("")
 .slice(0, 2)
 .toUpperCase();
}

export function TripEventCard({
 event,
 locale,
 isLast = false,
 showActions = false,
 className,
}: TripEventCardProps) {
 const t = useTranslations("event");
 const typeLabel = useEventDisplayLabel({
 type: event.type,
 mealType: event.mealType,
 placeName: event.place?.name,
 location: event.location,
 });
 const locationLabel = resolveMomentLocationLabel(event, event.place);
 const visiblePhotos = event.photos.slice(0, PHOTO_PREVIEW_LIMIT);
 const hiddenPhotoCount = event.photos.length - visiblePhotos.length;

 return (
 <article
 className={cn("group/card relative flex gap-3 pb-8 sm:gap-4", className)}
 >
 {!isLast && (
 <div
 className="absolute top-10 left-5 bottom-0 w-px bg-border-border"
 aria-hidden
 />
 )}

 <EventTypeIcon
 type={event.type}
 label={typeLabel}
 size="md"
 className="relative z-10 shrink-0"
 />

 <div
 className={cn(
 "min-w-0 flex-1 rounded-2xl bg-card ",
 "motion-safe:transition-[background-color,box-shadow] motion-safe:duration-500 hover:bg-card hover:shadow-sm",
 )}
 >
 <div className="space-y-3 p-4 sm:space-y-3.5 sm:p-5">
 {/* Header */}
 <div className="flex items-start gap-3">
 <div className="min-w-0 flex-1 space-y-2">
 <div className="flex flex-wrap items-center gap-2">
 <EventTypeBadge type={event.type} label={typeLabel} />
 {event.startTime && (
 <time className="text-xs tabular-nums text-muted-foreground">
 {formatTime(event.startTime, locale)}
 {event.endTime &&
 ` – ${formatTime(event.endTime, locale)}`}
 </time>
 )}
 </div>
 <h3 className="font-heading text-base font-medium tracking-tight sm:text-lg">
 {event.title}
 </h3>
 </div>

 {showActions && (
 <div className="flex shrink-0 gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover/card:opacity-100">
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("edit")}
 className="text-muted-foreground hover:text-foreground"
 render={
 <Link
 href={dashboardRoutes.editEvent(
 event.tripId,
 event.id,
 )}
 />
 }
 >
 <Pencil className="size-3.5" />
 </Button>
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("delete")}
 className="text-muted-foreground hover:text-destructive"
 >
 <Trash2 className="size-3.5" />
 </Button>
 </div>
 )}
 </div>

 {event.description && (
 <p className="text-sm leading-relaxed text-muted-foreground">
 {event.description}
 </p>
 )}

 {locationLabel && (
 <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
 <MapPin
 className="size-3.5 shrink-0 text-primary/80"
 aria-hidden
 />
 {locationLabel}
 </p>
 )}

 {event.participants.length > 0 && (
 <div className="flex items-center gap-2.5">
 <AvatarGroup>
 {event.participants.slice(0, 4).map((profile) => (
 <Avatar key={profile.id} size="sm">
 <AvatarImage
 src={profile.avatarUrl}
 alt={profile.displayName}
 />
 <AvatarFallback>{profileInitials(profile)}</AvatarFallback>
 </Avatar>
 ))}
 </AvatarGroup>
 <span className="text-xs text-muted-foreground">
 {t("participants", {
 names: event.participants
 .map((p) => p.displayName.split(" ")[0])
 .join(", "),
 })}
 </span>
 </div>
 )}

 {visiblePhotos.length > 0 && (
 <div
 className={cn(
 "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
 visiblePhotos.length === 1 && "max-w-xs",
 )}
 >
 {visiblePhotos.map((photo, index) => (
 <figure
 key={photo.id}
 className={cn(
 "relative shrink-0 overflow-hidden rounded-lg border border-border bg-muted",
 visiblePhotos.length === 1
 ? "aspect-[4/3] w-full"
 : "aspect-[4/3] w-28 sm:w-32",
 )}
 >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes={
                    visiblePhotos.length === 1
                      ? "320px"
                      : "(max-width: 640px) 112px, 128px"
                  }
                  unoptimized={isMemoraUploadedUrl(photo.url)}
                />
 {index === visiblePhotos.length - 1 &&
 hiddenPhotoCount > 0 && (
 <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white">
 {t("morePhotos", { count: hiddenPhotoCount })}
 </div>
 )}
 </figure>
 ))}
 </div>
 )}

 {event.cloudLinks.length > 0 && (
 <CloudLinkList
 links={event.cloudLinks}
 tripId={event.tripId}
 eventId={event.id}
 />
 )}
 </div>
 </div>
 </article>
 );
}
