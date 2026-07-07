import type { Equipment, Trip, TripEquipment } from "@/types";
import { DEFAULT_EQUIPMENT_CATEGORY_IDS } from "@/lib/mock-data/equipment-categories";
import { equipment, tripEquipmentLinks } from "@/lib/mock-data/equipment";
import { trips } from "@/lib/mock-data/trips";
import { getTripDuration } from "@/lib/format";

function getTripById(id: string): Trip | undefined {
 return trips.find((trip) => trip.id === id);
}

function getTripsByOwnerId(ownerId: string): Trip[] {
 return trips.filter((trip) => trip.ownerId === ownerId);
}

// --- Inventory accessors ---

export function getEquipmentByOwnerId(ownerId: string): Equipment[] {
 return equipment.filter((item) => item.ownerId === ownerId);
}

export function getEquipmentById(id: string): Equipment | undefined {
 return equipment.find((item) => item.id === id);
}

export function getActiveEquipmentByOwnerId(ownerId: string): Equipment[] {
 return getEquipmentByOwnerId(ownerId).filter((item) => item.isActive);
}

export function getEquipmentByCategoryId(
 ownerId: string,
 categoryId: string,
): Equipment[] {
 return getEquipmentByOwnerId(ownerId).filter(
 (item) => item.categoryId === categoryId,
 );
}

// --- Trip ↔ equipment join accessors ---

export function getTripEquipmentLinksByTripId(
 tripId: string,
): TripEquipment[] {
 return tripEquipmentLinks.filter((link) => link.tripId === tripId);
}

export function getEquipmentIdsByTripId(tripId: string): string[] {
 return getTripEquipmentLinksByTripId(tripId).map((link) => link.equipmentId);
}

export function getEquipmentByTripId(tripId: string): Equipment[] {
 const ids = new Set(getEquipmentIdsByTripId(tripId));
 return equipment.filter((item) => ids.has(item.id));
}

export function getTripLinksByEquipmentId(
 equipmentId: string,
): TripEquipment[] {
 return tripEquipmentLinks.filter((link) => link.equipmentId === equipmentId);
}

export function getTripsUsingEquipment(equipmentId: string): Trip[] {
 const tripIds = getTripLinksByEquipmentId(equipmentId).map(
 (link) => link.tripId,
 );
 return tripIds
 .map((id) => getTripById(id))
 .filter((trip): trip is Trip => trip !== undefined);
}

// --- Analytics (future-ready) ---

export function getEquipmentUsageCount(equipmentId: string): number {
 return getTripLinksByEquipmentId(equipmentId).length;
}

/** Nights spent using gear — sum of trip durations for linked trips */
export function getEquipmentNightsUsed(equipmentId: string): number {
 return getTripsUsingEquipment(equipmentId).reduce((total, trip) => {
 return total + getTripDuration(trip.startDate, trip.endDate);
 }, 0);
}

export function getTripBaseWeightGrams(tripId: string): number {
 return getEquipmentByTripId(tripId).reduce(
 (sum, item) => sum + item.weightGrams,
 0,
 );
}

export function getAverageBackpackWeightGrams(ownerId: string): number {
 const ownerTrips = getTripsByOwnerId(ownerId);
 if (ownerTrips.length === 0) return 0;

 const packItems = new Set(
 getEquipmentByOwnerId(ownerId)
 .filter((item) => item.categoryId === DEFAULT_EQUIPMENT_CATEGORY_IDS.BACKPACK)
 .map((item) => item.id),
 );

 let total = 0;
 let count = 0;

 for (const trip of ownerTrips) {
 const tripWeight = getEquipmentByTripId(trip.id)
 .filter((item) => packItems.has(item.id))
 .reduce((sum, item) => sum + item.weightGrams, 0);
 if (tripWeight > 0) {
 total += tripWeight;
 count += 1;
 }
 }

 return count > 0 ? Math.round(total / count) : 0;
}

export function getEquipmentUsedInCountry(
 ownerId: string,
 country: string,
): Equipment[] {
 const countryTripIds = new Set(
 getTripsByOwnerId(ownerId)
 .filter((trip) => trip.country === country)
 .map((trip) => trip.id),
 );

 const equipmentIds = new Set<string>();
 for (const link of tripEquipmentLinks) {
 if (countryTripIds.has(link.tripId)) {
 equipmentIds.add(link.equipmentId);
 }
 }

 return equipment.filter(
 (item) => item.ownerId === ownerId && equipmentIds.has(item.id),
 );
}

export function getMostUsedEquipment(
 ownerId: string,
 limit = 5,
): Array<{ equipment: Equipment; tripCount: number }> {
 const ownerEquipment = getEquipmentByOwnerId(ownerId);

 return ownerEquipment
 .map((item) => ({
 equipment: item,
 tripCount: getEquipmentUsageCount(item.id),
 }))
 .filter(({ tripCount }) => tripCount > 0)
 .sort((a, b) => b.tripCount - a.tripCount)
 .slice(0, limit);
}

export function getEquipmentUsedOnTripsWithTag(
 ownerId: string,
 tag: string,
): Equipment[] {
 const taggedTripIds = new Set(
 getTripsByOwnerId(ownerId)
 .filter((trip) =>
 trip.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
 )
 .map((trip) => trip.id),
 );

 const equipmentIds = new Set<string>();
 for (const link of tripEquipmentLinks) {
 if (taggedTripIds.has(link.tripId)) {
 equipmentIds.add(link.equipmentId);
 }
 }

 return equipment.filter(
 (item) => item.ownerId === ownerId && equipmentIds.has(item.id),
 );
}

/** All trips in the system — exported for analytics consumers */
export { trips as allTripsForAnalytics };
