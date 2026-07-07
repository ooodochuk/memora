"use client";

import { useTranslations } from "next-intl";
import type { TripDay, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { getDayDisplayTitle } from "@/lib/trip-timeline/utils";
import { TripDiaryEvent } from "@/components/dashboard/trip/trip-diary-event";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDaySectionProps {
 day: TripDay;
 events: TripEventWithRelations[];
 locale: AppLocale;
 onEdit?: () => void;
 onDelete?: () => void;
 onAddEvent?: () => void;
 onEditEvent?: (event: TripEventWithRelations) => void;
 onDeleteEvent?: (event: TripEventWithRelations) => void;
}

export function TripDaySection({
 day,
 events,
 locale,
 onEdit,
 onDelete,
 onAddEvent,
 onEditEvent,
 onDeleteEvent,
}: TripDaySectionProps) {
 const tTrip = useTranslations("trip");
 const tDetail = useTranslations("dashboard.pages.tripDetail");
 const tDay = useTranslations("dashboard.tripDayForm");

 const dayLabel = tTrip("dayLabel", { number: day.dayNumber });
 const displayTitle = getDayDisplayTitle(day, dayLabel);
 const formattedDate = formatDate(day.date, locale, {
 day: "numeric",
 month: "long",
 });

 return (
 <section className="space-y-4 border-b border-border pb-10 last:border-b-0">
 <header className="flex flex-wrap items-start gap-3">
 <div className="min-w-0 flex-1 space-y-1">
 <p className="font-heading text-xl font-medium tracking-tight sm:text-2xl">
 {displayTitle}
 </p>
 <time className="block text-sm text-muted-foreground">
 {formattedDate}
 </time>
 {day.summary && (
 <p className="max-w-2xl pt-1 text-sm leading-relaxed text-muted-foreground">
 {day.summary}
 </p>
 )}
 </div>

 {(onEdit || onDelete) && (
 <div className="flex items-center gap-1">
 {onEdit && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="h-8 gap-1.5 text-muted-foreground"
 onClick={onEdit}
 >
 <Pencil className="size-3.5" />
 <span className="sr-only sm:not-sr-only">
 {tDay("actions.editDay")}
 </span>
 </Button>
 )}
 {onDelete && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
 onClick={onDelete}
 >
 <Trash2 className="size-3.5" />
 <span className="sr-only sm:not-sr-only">
 {tDay("actions.deleteDay")}
 </span>
 </Button>
 )}
 </div>
 )}
 </header>

 <div className="space-y-0.5 pl-0 sm:pl-1">
 {events.length === 0 ? (
 <p className="py-2 text-sm text-muted-foreground">
 {tDetail("noEventsInDay")}
 </p>
 ) : (
 events.map((event) => (
 <TripDiaryEvent
 key={event.id}
 event={event}
 locale={locale}
 onEdit={onEditEvent ? () => onEditEvent(event) : undefined}
 onDelete={
 onDeleteEvent ? () => onDeleteEvent(event) : undefined
 }
 />
 ))
 )}
 </div>

 {onAddEvent && (
 <Button
 type="button"
 variant="ghost"
 onClick={onAddEvent}
 className={cn(
 "h-auto gap-2 px-0 text-muted-foreground",
 "hover:bg-transparent hover:text-foreground",
 )}
 >
 <Plus className="size-4 text-primary" />
 {tDetail("actions.addEvent")}
 </Button>
 )}
 </section>
 );
}
