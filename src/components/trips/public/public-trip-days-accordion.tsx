"use client";

import type { TripDay, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { TripDayAccordionItem } from "@/components/dashboard/trip/trip-day-accordion-item";
import { Accordion } from "@/components/ui/accordion";

interface PublicTripDaysAccordionProps {
 days: Array<{ day: TripDay; events: TripEventWithRelations[] }>;
 locale: AppLocale;
}

export function PublicTripDaysAccordion({
 days,
 locale,
}: PublicTripDaysAccordionProps) {
 return (
 <Accordion defaultValue={[]} multiple className="w-full">
 {days.map(({ day, events }) => (
 <TripDayAccordionItem
 key={day.id}
 day={day}
 events={events}
 locale={locale}
 />
 ))}
 </Accordion>
 );
}
