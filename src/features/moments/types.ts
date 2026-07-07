import type { MealType, TripEventType } from "@/types";

export interface MomentLocationDto {
  name?: string;
  latitude: number;
  longitude: number;
}

/** Backend moment (trip event) contract */
export interface MomentDto {
  id: string;
  tripId: string;
  dayId: string;
  type: TripEventType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  placeId?: string;
  location?: MomentLocationDto;
  photoIds: string[];
  photoUrl?: string;
  cloudLinkIds: string[];
  participantIds: string[];
  tags: string[];
  order: number;
  amount?: number;
  currency?: string;
  distanceKm?: number;
  elevationGainM?: number;
  mealType?: MealType;
}

export interface CreateMomentRequestDto {
  type: TripEventType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  placeId?: string;
  location?: MomentLocationDto;
  photoIds?: string[];
  photoUrl?: string;
  clearPhoto?: boolean;
  cloudLinkIds?: string[];
  participantIds?: string[];
  tags?: string[];
  order?: number;
  amount?: number;
  currency?: string;
  distanceKm?: number;
  elevationGainM?: number;
  mealType?: MealType;
}

export type UpdateMomentRequestDto = Partial<CreateMomentRequestDto>;
