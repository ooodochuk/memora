"use client";

import { useTranslations } from "next-intl";
import type { TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDiaryEventProps {
 event: TripEventWithRelations;
 locale: AppLocale;
 onEdit?: () => void;
 onDelete?: () => void;
 className?: string;
}

export function TripDiaryEvent({
 event,
 locale,
 onEdit,
 onDelete,
 className,
}: TripDiaryEventProps) {
 const t = useTranslations("event");
 const tMeals = useTranslations("event.mealTypes");
 const showActions = onEdit || onDelete;

 const secondaryLine =
 event.place?.name ??
 (event.type === "FOOD" && event.mealType
 ? tMeals(event.mealType)
 : undefined) ??
 event.description;

 return (
 <article
 className={cn(
 "group/event relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-4",
 className,
 )}
 >
 <time className="pt-0.5 text-sm tabular-nums text-muted-foreground">
 {event.startTime ? formatTime(event.startTime, locale) : "—"}
 </time>

 <div className="min-w-0 space-y-1">
 <div className="flex items-start gap-2">
 <h3 className="min-w-0 flex-1 font-heading text-base font-medium tracking-tight sm:text-lg">
 {event.title}
 </h3>
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

 {event.place && (
 <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
 <MapPin className="size-3.5 shrink-0 text-primary/80" aria-hidden />
 {event.place.name}
 </p>
 )}

 {!event.place && secondaryLine && secondaryLine !== event.title && (
 <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
 {secondaryLine}
 </p>
 )}

 {(event.distanceKm != null || event.elevationGainM != null) && (
 <p className="text-xs text-muted-foreground">
 {event.distanceKm != null && t("distance", { km: event.distanceKm })}
 {event.distanceKm != null && event.elevationGainM != null && " · "}
 {event.elevationGainM != null &&
 t("elevation", { m: event.elevationGainM })}
 </p>
 )}
 </div>
 </article>
 );
}
