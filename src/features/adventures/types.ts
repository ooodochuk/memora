import type {
  AdventureType,
  DayActivityType,
  TripEventType,
  TripStatus,
  TripVisibility,
} from "@/types";

/** Backend adventure (trip) contract */
export interface AdventureDto {
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
  adventureType: AdventureType;
  stats: AdventureStatsDto;
}

export interface AdventureStatsDto {
  dayCount: number;
  eventCount: number;
  photoCount: number;
  placeCount: number;
  distanceKm?: number;
  elevationGainM?: number;
}

export interface AdventureSummaryDto {
  adventure: AdventureDto;
  cloudLinkCount: number;
}

export interface DashboardStatsDto {
  totalTrips: number;
  totalDays: number;
  countries: number;
  places: number;
  hikingKm: number;
  cyclingKm: number;
  drivingKm: number;
}

export interface DashboardHomeDto {
  stats: DashboardStatsDto;
}

export interface CreateAdventureRequestDto {
  title: string;
  subtitle?: string;
  description: string;
  coverImageUrl: string;
  country: string;
  region: string;
  startDate: string;
  endDate?: string;
  status: TripStatus;
  visibility: TripVisibility;
  adventureType: AdventureType;
  tags?: string[];
}

export type UpdateAdventureRequestDto = Partial<CreateAdventureRequestDto>;

/** Re-export for cross-feature typing where needed */
export type { DayActivityType, TripEventType };
