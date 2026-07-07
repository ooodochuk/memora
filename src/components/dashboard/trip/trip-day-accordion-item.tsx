"use client";

import { useTranslations } from "next-intl";
import type { TripDay, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDayHeaderDate } from "@/lib/format";
import { DayActivityList } from "@/components/day-activities";
import { TripTimelineEventCard } from "@/components/dashboard/trip/trip-timeline-event-card";
import {
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDayAccordionItemProps {
 day: TripDay;
 events: TripEventWithRelations[];
 locale: AppLocale;
 onEdit?: () => void;
 onDelete?: () => void;
 onAddEvent?: () => void;
 onEditEvent?: (event: TripEventWithRelations) => void;
 onDeleteEvent?: (event: TripEventWithRelations) => void;
}

export function TripDayAccordionItem({
 day,
 events,
 locale,
 onEdit,
 onDelete,
 onAddEvent,
 onEditEvent,
 onDeleteEvent,
}: TripDayAccordionItemProps) {
 const tTrip = useTranslations("trip");
 const tDetail = useTranslations("dashboard.pages.tripDetail");
 const tDay = useTranslations("dashboard.tripDayForm");

 const dayLabel = tTrip("dayLabel", { number: day.dayNumber });
 const formattedDate = formatDayHeaderDate(day.date, locale);
 const dayTitle = day.title?.trim();
 const hasDayActions = onEdit || onDelete;

 return (
 <AccordionItem
 value={day.id}
 className={cn(
 "mb-2 overflow-hidden rounded-xl border border-border bg-card",
 "border-b last:mb-0 data-open:border-border",
 )}
 >
 <AccordionTrigger
 className={cn(
 "w-full px-5 py-4 hover:no-underline",
 "[&_[data-slot=accordion-trigger-icon]]:text-muted-foreground",
 )}
 >
 <span className="font-medium text-foreground">{dayLabel}</span>
 </AccordionTrigger>

 <AccordionContent className="px-5 pb-5">
 <div className="space-y-5 border-t border-border pt-5">
 <div className="space-y-3">
 <div
 className={cn(
 "flex gap-3",
 hasDayActions && "items-start justify-between",
 )}
 >
 <div className="min-w-0 space-y-1">
 {dayTitle && (
 <h3 className="font-heading text-lg font-medium tracking-tight text-foreground">
 {dayTitle}
 </h3>
 )}
 <time
 dateTime={day.date}
 className="block text-sm text-muted-foreground"
 >
 {formattedDate}
 </time>
 </div>

 {hasDayActions && (
 <div className="flex shrink-0 items-center gap-1">
 {onEdit && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="h-8 gap-1.5 text-muted-foreground"
 onClick={onEdit}
 >
 <Pencil className="size-3.5" />
 {tDay("actions.editDay")}
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
 {tDay("actions.deleteDay")}
 </Button>
 )}
 </div>
 )}
 </div>

 {day.summary && (
 <p className="text-sm leading-relaxed text-muted-foreground">
 {day.summary}
 </p>
 )}

 {(day.activities?.length ?? 0) > 0 && (
 <DayActivityList activities={day.activities} size="md" />
 )}
 </div>

 <div className="space-y-3">
 {events.length === 0 ? (
 <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
 {tDetail("noEventsInDay")}
 </p>
 ) : (
 events.map((event) => (
 <TripTimelineEventCard
 key={event.id}
 event={event}
 locale={locale}
 onEdit={
 onEditEvent ? () => onEditEvent(event) : undefined
 }
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
 variant="outline"
 onClick={onAddEvent}
 className={cn(
 "w-full gap-2 border-dashed border-border",
 "hover:border-primary/50 hover:bg-primary/5",
 )}
 >
 <Plus className="size-4 text-primary" />
 {tDetail("actions.addEvent")}
 </Button>
 )}
 </div>
 </AccordionContent>
 </AccordionItem>
 );
}
