import type { TripStatus, TripVisibility } from "./enums";

export interface TripStats {
 dayCount: number;
 eventCount: number;
 photoCount: number;
 placeCount: number;
 distanceKm?: number;
 elevationGainM?: number;
}

export interface Trip {
 id: string;
 slug: string;
 ownerId: string;
 title: string;
 subtitle: string;
 description: string;
 coverImageUrl: string;
 country: string;
 region: string;
 startDate: string;
 endDate?: string;
 status: TripStatus;
 visibility: TripVisibility;
 tags: string[];
 /** Primary adventure type — used for filters, stats, and equipment suggestions */
 adventureType: import("./enums").AdventureType;
 stats: TripStats;
}

export interface TripParticipant {
 id: string;
 tripId: string;
 profileId: string;
 role: import("./enums").TripParticipantRole;
 joinedAt: string;
}

export interface TripDay {
 id: string;
 tripId: string;
 dayNumber: number;
 date: string;
 title?: string;
 summary?: string;
 coverImageUrl?: string;
 /** Outdoor / travel activity tags for this day only */
 activities: import("./enums").DayActivityType[];
}

export interface TripEventLocation {
 name?: string;
 latitude: number;
 longitude: number;
}

export interface TripEvent {
 id: string;
 tripId: string;
 dayId: string;
 type: import("./enums").TripEventType;
 title: string;
 description?: string;
 startTime?: string;
 endTime?: string;
 /** @deprecated Legacy place reference — prefer `location` */
 placeId?: string;
 /** Lightweight map pin — no separate Place entity required */
 location?: TripEventLocation;
 photoIds: string[];
 cloudLinkIds: string[];
 participantIds: string[];
 tags: string[];
 order: number;
 /** EXPENSE */
 amount?: number;
 currency?: string;
 /** HIKE / BIKE */
 distanceKm?: number;
 elevationGainM?: number;
 /** FOOD */
 mealType?: import("./enums").MealType;
}

export interface TripEventParticipant {
 id: string;
 eventId: string;
 profileId: string;
}
