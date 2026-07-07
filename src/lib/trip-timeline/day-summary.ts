import type { TripEventType, TripEventWithRelations } from "@/types";

/** Display order for collapsed day summary chips */
export const EVENT_SUMMARY_TYPE_ORDER: TripEventType[] = [
 "BIKE",
 "HIKE",
 "FOOD",
 "SLEEP",
 "PLACE_VISIT",
 "TRANSPORT",
 "PHOTO_VIDEO",
 "EXPENSE",
 "NOTE",
 "TIP",
];

export function countEventsByType(
 events: TripEventWithRelations[],
): Partial<Record<TripEventType, number>> {
 const counts: Partial<Record<TripEventType, number>> = {};
 for (const event of events) {
 counts[event.type] = (counts[event.type] ?? 0) + 1;
 }
 return counts;
}

export function getDayLocationLabel(day: {
 title?: string;
 dayNumber: number;
}): string | undefined {
 const title = day.title?.trim();
 if (!title) return undefined;
 return title;
}

export function countPhotosInDay(events: TripEventWithRelations[]): number {
 return events.reduce((total, event) => total + event.photos.length, 0);
}
