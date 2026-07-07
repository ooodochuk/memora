import type { AppLocale } from "@/constants";
import type { CloudLink } from "./cloud-link";
import type { Place } from "./place";
import type { Photo } from "./photo";
import type { Profile } from "./profile";
import type { TripEvent } from "./trip";

export type { AppLocale };

/** @deprecated Use AppLocale from @/constants */
export type Locale = AppLocale;

export type {
 TripVisibility,
 TripStatus,
 TripEventType,
 TripParticipantRole,
 CloudLinkProvider,
 CloudLinkContentType,
 PlaceCategory,
 MealType,
 DayActivityType,
 AdventureType,
} from "./enums";

export type { User } from "./user";
export type { Profile, ProfileStats } from "./profile";
export type {
 Trip,
 TripStats,
 TripParticipant,
 TripDay,
 TripEvent,
 TripEventLocation,
 TripEventParticipant,
} from "./trip";
export type { Place } from "./place";
export type { Photo } from "./photo";
export type { CloudLink } from "./cloud-link";
export type { Equipment, EquipmentCategory, TripEquipment } from "./equipment";
export type {
  DashboardStats,
  DashboardHomeData,
} from "./dashboard";

/** Resolved event for UI rendering */
export interface TripEventWithRelations extends TripEvent {
 place?: Place;
 photos: Photo[];
 cloudLinks: CloudLink[];
 participants: Profile[];
}
