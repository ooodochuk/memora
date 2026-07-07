import type {
 CloudLink,
 Photo,
 Place,
 Profile,
 Trip,
 TripDay,
 TripEvent,
 TripEventWithRelations,
 User,
} from "@/types";
import { FEATURED_TRIPS_LIMIT } from "@/constants";

import { users, currentUser } from "./users";
import { profiles, currentProfile } from "./profiles";
import { trips } from "./trips";
import { tripParticipants } from "./trip-participants";
import { tripEventParticipants } from "./trip-event-participants";
import { tripDays } from "./trip-days";
import { tripEvents } from "./trip-events";
import { places } from "./places";
import { photos } from "./photos";
import { cloudLinks } from "./cloud-links";
import { equipment, tripEquipmentLinks } from "./equipment";

export {
 users,
 currentUser,
 profiles,
 currentProfile,
 trips,
 tripParticipants,
 tripEventParticipants,
 tripDays,
 tripEvents,
 places,
 photos,
 cloudLinks,
};

// --- Users & profiles ---

export function getUserById(id: string): User | undefined {
 return users.find((u) => u.id === id);
}

export function getCurrentUser(): User {
 return currentUser;
}

export function getProfileByUsername(username: string): Profile | undefined {
 return profiles.find((p) => p.username === username);
}

export function getProfileById(id: string): Profile | undefined {
 return profiles.find((p) => p.id === id);
}

export function getCurrentProfile(): Profile {
 return currentProfile;
}

// --- Trips ---

export function getTripsByOwnerId(ownerId: string): Trip[] {
 return trips.filter((t) => t.ownerId === ownerId);
}

/** @deprecated Use getTripsByOwnerId */
export function getTripsByProfileId(profileId: string): Trip[] {
 return getTripsByOwnerId(profileId);
}

export function getTripBySlug(slug: string): Trip | undefined {
 return trips.find((t) => t.slug === slug);
}

export function getTripById(id: string): Trip | undefined {
 return trips.find((t) => t.id === id);
}

export function getFeaturedTrips(limit = FEATURED_TRIPS_LIMIT): Trip[] {
 return trips
 .filter((t) => t.visibility === "public" && t.status === "published")
 .slice(0, limit);
}

export function getAllPublicTrips(): Trip[] {
 return trips.filter(
 (t) => t.visibility === "public" && t.status === "published",
 );
}

// --- Days & events ---

export function getDaysByTripId(tripId: string): TripDay[] {
 return tripDays
 .filter((d) => d.tripId === tripId)
 .sort((a, b) => a.dayNumber - b.dayNumber);
}

export function getDayById(dayId: string): TripDay | undefined {
 return tripDays.find((d) => d.id === dayId);
}

export function getEventsByDayId(dayId: string): TripEvent[] {
 return tripEvents
 .filter((e) => e.dayId === dayId)
 .sort((a, b) => a.order - b.order);
}

export function getEventsByTripId(tripId: string): TripEvent[] {
 return tripEvents
 .filter((e) => e.tripId === tripId)
 .sort((a, b) => a.order - b.order);
}

export function getEventById(eventId: string): TripEvent | undefined {
 return tripEvents.find((e) => e.id === eventId);
}

// --- Places, photos, cloud links ---

export function getPlacesByTripId(tripId: string): Place[] {
 return places.filter((p) => p.tripId === tripId);
}

export function getPlaceById(placeId: string): Place | undefined {
 return places.find((p) => p.id === placeId);
}

export function getPhotosByTripId(tripId: string): Photo[] {
 return photos.filter((p) => p.tripId === tripId);
}

export function getPhotosByIds(ids: string[]): Photo[] {
 return ids
 .map((id) => photos.find((p) => p.id === id))
 .filter((p): p is Photo => p !== undefined);
}

export function getCloudLinksByTripId(tripId: string): CloudLink[] {
 return cloudLinks.filter((c) => c.tripId === tripId);
}

export function getCloudLinksByIds(ids: string[]): CloudLink[] {
 return ids
 .map((id) => cloudLinks.find((c) => c.id === id))
 .filter((c): c is CloudLink => c !== undefined);
}

export function getCloudLinksByEventId(eventId: string): CloudLink[] {
 return cloudLinks.filter((c) => c.eventId === eventId);
}

// --- Resolved relations for UI ---

export function resolveEventRelations(event: TripEvent): TripEventWithRelations {
 return {
 ...event,
 place: event.placeId ? getPlaceById(event.placeId) : undefined,
 photos: getPhotosByIds(event.photoIds),
 cloudLinks: getCloudLinksByIds(event.cloudLinkIds),
 participants: event.participantIds
 .map((id) => getProfileById(id))
 .filter((p): p is Profile => p !== undefined),
 };
}

export function getEventsWithRelationsByDayId(
 dayId: string,
): TripEventWithRelations[] {
 return getEventsByDayId(dayId).map(resolveEventRelations);
}

export function countEventsForTrip(tripId: string): number {
 return tripEvents.filter((e) => e.tripId === tripId).length;
}

export { getDashboardHomeData, getEmptyDashboardHomeData } from "./dashboard";
export { equipment, tripEquipmentLinks };
export {
 getEquipmentByOwnerId,
 getEquipmentById,
 getActiveEquipmentByOwnerId,
 getEquipmentByTripId,
 getEquipmentIdsByTripId,
} from "@/lib/equipment/accessors";
