import { getTripsByOwnerId } from "@/lib/mock-data/accessors";
import { places } from "@/lib/mock-data/places";
import { tripDays } from "@/lib/mock-data/trip-days";
import { tripEvents } from "@/lib/mock-data/trip-events";
import { computeTravelModeDistances } from "@/lib/travel-mode-stats";
import type { DashboardStats } from "@/types/dashboard";

/** Split trip.country values like "Poland · Lithuania" into unique country names. */
export function parseTripCountries(countryField: string): string[] {
 return countryField
 .split(/[·,]/g)
 .map((part) => part.trim())
 .filter(Boolean);
}

export function computeDashboardStats(ownerId: string): DashboardStats {
 const ownerTrips = getTripsByOwnerId(ownerId);
 const tripIds = new Set(ownerTrips.map((trip) => trip.id));
 const ownerEvents = tripEvents.filter((event) => tripIds.has(event.tripId));
 const ownerDayRecords = tripDays.filter((day) => tripIds.has(day.tripId));

 const countrySet = new Set<string>();
 for (const trip of ownerTrips) {
 for (const country of parseTripCountries(trip.country)) {
 countrySet.add(country);
 }
 }

 const placeSet = new Set<string>();
 for (const place of places) {
 if (tripIds.has(place.tripId)) placeSet.add(place.id);
 }
 for (const event of ownerEvents) {
 if (event.placeId) placeSet.add(event.placeId);
 }

 const { hikingKm, cyclingKm, drivingKm } =
 computeTravelModeDistances(ownerTrips);

 const totalDays =
 ownerDayRecords.length > 0
 ? ownerDayRecords.length
 : ownerTrips.reduce((sum, trip) => sum + trip.stats.dayCount, 0);

 return {
 totalTrips: ownerTrips.length,
 totalDays,
 countries: countrySet.size,
 places: placeSet.size,
 hikingKm,
 cyclingKm,
 drivingKm,
 };
}

export function emptyDashboardStats(): DashboardStats {
 return {
 totalTrips: 0,
 totalDays: 0,
 countries: 0,
 places: 0,
 hikingKm: 0,
 cyclingKm: 0,
 drivingKm: 0,
 };
}
