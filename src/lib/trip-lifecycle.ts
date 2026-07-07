import type { Trip } from "@/types";

export type TripLifecycle = "planning" | "in_progress" | "completed";

export type TripLifecycleFilter = "all" | TripLifecycle;

function startOfDay(date: Date): Date {
 const d = new Date(date);
 d.setHours(0, 0, 0, 0);
 return d;
}

export function getTripLifecycle(trip: Trip, now = new Date()): TripLifecycle {
 if (trip.status === "planning" || trip.status === "draft") {
 return "planning";
 }

 if (trip.status === "archived") {
 return "completed";
 }

 const today = startOfDay(now);
 const start = startOfDay(new Date(trip.startDate));

 if (trip.endDate) {
 const end = startOfDay(new Date(trip.endDate));
 if (today > end) return "completed";
 if (today >= start) return "in_progress";
 } else if (today >= start) {
 return "in_progress";
 }

 return "planning";
}

export function matchesTripLifecycleFilter(
 trip: Trip,
 filter: TripLifecycleFilter,
 now = new Date(),
): boolean {
 if (filter === "all") return true;
 return getTripLifecycle(trip, now) === filter;
}

export function matchesTripSearch(trip: Trip, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    trip.title,
    trip.subtitle,
    trip.description,
    trip.country,
    trip.region,
    ...trip.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

const LIFECYCLE_ORDER: TripLifecycle[] = [
  "in_progress",
  "planning",
  "completed",
];

function sortTripsByStartDate(trips: Trip[]): Trip[] {
  return [...trips].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export function groupTripsByLifecycle(
  trips: Trip[],
  now = new Date(),
): Record<TripLifecycle, Trip[]> {
  const groups: Record<TripLifecycle, Trip[]> = {
    in_progress: [],
    planning: [],
    completed: [],
  };

  for (const trip of trips) {
    groups[getTripLifecycle(trip, now)].push(trip);
  }

  for (const lifecycle of LIFECYCLE_ORDER) {
    groups[lifecycle] = sortTripsByStartDate(groups[lifecycle]);
  }

  return groups;
}

export { LIFECYCLE_ORDER };
