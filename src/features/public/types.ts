import type { AdventureDto } from "@/features/adventures/types";
import type { DayDto } from "@/features/days/types";
import type { CloudLinkDto } from "@/features/media/types";
import type { MomentDto } from "@/features/moments/types";

export interface PublicProfileDto {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  tagline: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string;
  website?: string | null;
  createdAt: string;
}

export interface PublicTravelStatsDto {
  adventureCount: number;
  countryCount: number;
  totalDays: number;
  totalMoments: number;
  totalPhotos: number;
  hikingKm: number;
  cyclingKm: number;
  drivingKm: number;
}

export interface PublicPortfolioDto {
  profile: PublicProfileDto;
  adventures: AdventureDto[];
  travelStats: PublicTravelStatsDto;
}

export interface PublicEquipmentDto {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  weightGrams: number;
  photoUrl?: string;
  notes?: string;
}

export interface PublicAdventureDetailDto {
  profile: PublicProfileDto;
  adventure: AdventureDto;
  days: DayDto[];
  moments: MomentDto[];
  cloudLinks: CloudLinkDto[];
  equipment: PublicEquipmentDto[];
}
