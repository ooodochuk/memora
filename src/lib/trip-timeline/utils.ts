import type { CloudLink, Place, Profile, TripDay, TripEvent } from "@/types";
import type { TripEventWithRelations } from "@/types";
import { assignDayNumbers } from "@/lib/validations/trip-day-form";

export interface TripTimelineDay {
 day: TripDay;
 events: TripEventWithRelations[];
}

export function sortEventsForTimeline(
 events: TripEventWithRelations[],
): TripEventWithRelations[] {
 return [...events].sort((a, b) => a.order - b.order);
}

export function normalizeTimelineDays(
 days: TripTimelineDay[],
): TripTimelineDay[] {
 const numbered = assignDayNumbers(days.map((entry) => entry.day));
 const dayMap = new Map(numbered.map((day) => [day.id, day]));

 return [...days]
 .sort((a, b) => a.day.date.localeCompare(b.day.date))
 .map((entry) => ({
 day: dayMap.get(entry.day.id) ?? entry.day,
 events: sortEventsForTimeline(entry.events),
 }));
}

export function resolveEventRelations(
 event: TripEvent,
 places: Place[],
 cloudLinks: CloudLink[],
 allPhotos: import("@/types").Photo[] = [],
 participants: Profile[] = [],
): TripEventWithRelations {
 const photoIdSet = new Set(event.photoIds);
 const photosFromIds = allPhotos.filter((photo) => photoIdSet.has(photo.id));
 const photos =
  photosFromIds.length > 0
   ? photosFromIds
   : event.photoUrl
    ? [
      {
       id: `${event.id}-photo`,
       tripId: event.tripId,
       url: event.photoUrl,
       alt: event.title,
       eventId: event.id,
      },
     ]
    : [];

 return {
 ...event,
 place: event.placeId
 ? places.find((place) => place.id === event.placeId)
 : undefined,
 photos,
 cloudLinks: cloudLinks.filter((link) =>
 event.cloudLinkIds.includes(link.id),
 ),
 participants,
 };
}

export function nextEventOrder(events: TripEvent[]): number {
 if (events.length === 0) return 1;
 return Math.max(...events.map((event) => event.order)) + 1;
}

export function getDayDisplayTitle(
 day: TripDay,
 dayLabel: string,
): string {
 return day.title?.trim() || dayLabel;
}
