import { tripDays } from "@/lib/mock-data/trip-days";
import { tripEvents } from "@/lib/mock-data/trip-events";
import type { Trip } from "@/types";
import {
 CYCLING_DAY_ACTIVITIES,
 DRIVING_DAY_ACTIVITIES,
 HIKING_DAY_ACTIVITIES,
 dayHasAnyActivity,
} from "@/lib/day-activities";

export interface TravelModeDistances {
 hikingKm: number;
 cyclingKm: number;
 drivingKm: number;
}

export function computeTravelModeDistances(trips: Trip[]): TravelModeDistances {
 if (trips.length === 0) {
 return { hikingKm: 0, cyclingKm: 0, drivingKm: 0 };
 }

 const tripIds = new Set(trips.map((trip) => trip.id));
 const events = tripEvents.filter((event) => tripIds.has(event.tripId));
 const days = tripDays.filter((day) => tripIds.has(day.tripId));

 const hikingFromEvents = events
 .filter((event) => event.type === "HIKE")
 .reduce((sum, event) => sum + (event.distanceKm ?? 0), 0);

 const hikingFromActivityTrips = trips
 .filter((trip) => {
 const tripDayList = days.filter((day) => day.tripId === trip.id);
 return tripDayList.some((day) =>
 dayHasAnyActivity(day, HIKING_DAY_ACTIVITIES),
 );
 })
 .reduce((sum, trip) => sum + (trip.stats.distanceKm ?? 0), 0);

 const cyclingFromEvents = events
 .filter((event) => event.type === "BIKE")
 .reduce((sum, event) => sum + (event.distanceKm ?? 0), 0);

 const cyclingFromActivityTrips = trips
 .filter((trip) => {
 const tripDayList = days.filter((day) => day.tripId === trip.id);
 return tripDayList.some((day) =>
 dayHasAnyActivity(day, CYCLING_DAY_ACTIVITIES),
 );
 })
 .reduce((sum, trip) => sum + (trip.stats.distanceKm ?? 0), 0);

 const drivingFromEvents = events
 .filter((event) => event.type === "TRANSPORT")
 .reduce((sum, event) => sum + (event.distanceKm ?? 0), 0);

 const drivingFromActivityTrips = trips
 .filter((trip) => {
 const tripDayList = days.filter((day) => day.tripId === trip.id);
 return tripDayList.some((day) =>
 dayHasAnyActivity(day, DRIVING_DAY_ACTIVITIES),
 );
 })
 .reduce((sum, trip) => sum + (trip.stats.distanceKm ?? 0), 0);

 return {
 hikingKm: Math.round(
 Math.max(hikingFromEvents, hikingFromActivityTrips * 0.85),
 ),
 cyclingKm: Math.round(
 Math.max(cyclingFromEvents, cyclingFromActivityTrips),
 ),
 drivingKm: Math.round(
 Math.max(drivingFromEvents, drivingFromActivityTrips * 0.6),
 ),
 };
}
