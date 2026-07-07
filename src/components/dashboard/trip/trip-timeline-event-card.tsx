"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Profile, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatTime } from "@/lib/format";
import { resolveMomentLocationLabel } from "@/lib/event-display";
import { isMemoraUploadedUrl } from "@/lib/media-url";
import { eventTypeStyles } from "@/lib/design-system/tokens";
import {
 EventTypeIcon,
 useEventDisplayLabel,
} from "@/components/design-system/event-type-badge";
import { CloudLinkList } from "@/components/cloud-links";
import {
 Avatar,
 AvatarFallback,
 AvatarGroup,
 AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PHOTO_PREVIEW_LIMIT = 3;

interface TripTimelineEventCardProps {
 event: TripEventWithRelations;
 locale: AppLocale;
 onEdit?: () => void;
 onDelete?: () => void;
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

export function TripTimelineEventCard({
 event,
 locale,
 onEdit,
 onDelete,
 className,
}: TripTimelineEventCardProps) {
 const t = useTranslations("event");
 const typeLabel = useEventDisplayLabel({
 type: event.type,
 mealType: event.mealType,
 placeName: event.place?.name,
 location: event.location,
 });
 const locationLabel = resolveMomentLocationLabel(event, event.place);
 const colors = eventTypeStyles(event.type);
 const showActions = onEdit || onDelete;
 const visiblePhotos = event.photos.slice(0, PHOTO_PREVIEW_LIMIT);
 const hiddenPhotoCount = event.photos.length - visiblePhotos.length;

 return (
 <article
 className={cn(
 "group/event overflow-hidden rounded-2xl border border-border bg-card",
 "motion-safe:transition-[box-shadow,background-color] motion-safe:duration-300",
 "hover:bg-card hover:shadow-sm",
 className,
 )}
 style={{
 borderLeftWidth: 3,
 borderLeftColor: colors.bg,
 }}
 >
 <div className="space-y-3 p-4 sm:p-5">
 <div className="flex items-start gap-3 sm:gap-4">
 <EventTypeIcon
 type={event.type}
 label={typeLabel}
 size="lg"
 className="shrink-0"
 />

 <div className="min-w-0 flex-1 space-y-1.5">
 <div className="flex items-start gap-2">
 <div className="min-w-0 flex-1 space-y-1">
 <p
 className="text-[0.6875rem] font-medium uppercase tracking-[0.12em]"
 style={{ color: colors.fg }}
 >
 {typeLabel}
 </p>
 <h3 className="font-heading text-lg font-medium tracking-tight sm:text-xl">
 {event.title}
 </h3>
 </div>
 {event.startTime && (
 <time className="shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
 {formatTime(event.startTime, locale)}
 </time>
 )}
 {showActions && (
 <div className="flex shrink-0 gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover/event:opacity-100">
 {onEdit && (
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("edit")}
 onClick={onEdit}
 >
 <Pencil className="size-3.5" />
 </Button>
 )}
 {onDelete && (
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("delete")}
 className="hover:text-destructive"
 onClick={onDelete}
 >
 <Trash2 className="size-3.5" />
 </Button>
 )}
 </div>
 )}
 </div>

 {locationLabel && event.type !== "SLEEP" && (
 <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
 <MapPin
 className="size-3.5 shrink-0 text-primary/80"
 aria-hidden
 />
 {locationLabel}
 </p>
 )}
 </div>
 </div>

 {event.description && (
 <p className="pl-[3.25rem] text-sm leading-relaxed text-muted-foreground sm:pl-[4rem]">
 {event.description}
 </p>
 )}

 {(event.distanceKm != null || event.elevationGainM != null) && (
 <p className="pl-[3.25rem] text-xs text-muted-foreground sm:pl-[4rem]">
 {event.distanceKm != null &&
 t("distance", { km: event.distanceKm })}
 {event.distanceKm != null && event.elevationGainM != null && " · "}
 {event.elevationGainM != null &&
 t("elevation", { m: event.elevationGainM })}
 </p>
 )}

 {event.cloudLinks.length > 0 && (
 <div className="pl-[3.25rem] sm:pl-[4rem]">
 <CloudLinkList
 links={event.cloudLinks}
 tripId={event.tripId}
 eventId={event.id}
 />
 </div>
 )}

 {event.participants.length > 0 && (
 <div className="flex items-center gap-2.5 pl-[3.25rem] sm:pl-[4rem]">
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
 <div className="flex gap-2 overflow-x-auto pb-0.5 pl-[3.25rem] sm:pl-[4rem]">
 {visiblePhotos.map((photo, index) => (
 <figure
 key={photo.id}
 className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg border border-border sm:w-32"
 >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="128px"
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

 {showActions && (
 <div className="flex gap-1 border-t border-border pt-3 sm:hidden">
 {onEdit && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="gap-1.5 text-muted-foreground"
 onClick={onEdit}
 >
 <Pencil className="size-3.5" />
 {t("edit")}
 </Button>
 )}
 {onDelete && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="gap-1.5 text-muted-foreground hover:text-destructive"
 onClick={onDelete}
 >
 <Trash2 className="size-3.5" />
 {t("delete")}
 </Button>
 )}
 </div>
 )}
 </div>
 </article>
 );
}
