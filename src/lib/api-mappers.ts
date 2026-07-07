import type { AdventureDto } from "@/features/adventures/types";
import type { DayDto } from "@/features/days/types";
import type { MomentDto } from "@/features/moments/types";
import type { EquipmentDto, EquipmentCategoryDto } from "@/features/equipment/types";
import type {
  AdventureType,
  DayActivityType,
  Trip,
  TripDay,
  TripEvent,
  TripEventType,
  TripStatus,
  TripVisibility,
} from "@/types";
import type { Equipment, EquipmentCategory } from "@/types";
import type {
  CreateAdventureRequestDto,
  UpdateAdventureRequestDto,
} from "@/features/adventures/types";
import type { TripFormValues } from "@/lib/validations/trip-form";
import type { TripDayFormValues } from "@/lib/validations/trip-day-form";
import type { CreateDayRequestDto } from "@/features/days/types";
import { normalizeDayActivities } from "@/lib/day-activities";

export function adventureDtoToTrip(dto: AdventureDto): Trip {
  return {
    id: dto.id,
    slug: dto.slug,
    ownerId: dto.ownerId,
    title: dto.title,
    subtitle: dto.subtitle,
    description: dto.description,
    coverImageUrl: dto.coverImageUrl,
    country: dto.country,
    region: dto.region,
    startDate: dto.startDate,
    endDate: dto.endDate,
    status: dto.status as TripStatus,
    visibility: dto.visibility as TripVisibility,
    tags: dto.tags,
    adventureType: dto.adventureType as AdventureType,
    stats: dto.stats,
  };
}

export function dayDtoToTripDay(dto: DayDto): TripDay {
  return {
    id: dto.id,
    tripId: dto.tripId,
    dayNumber: dto.dayNumber,
    date: dto.date,
    title: dto.title,
    summary: dto.summary,
    coverImageUrl: dto.coverImageUrl,
    activities: normalizeDayActivities(dto.activities ?? []) as DayActivityType[],
  };
}

export function momentDtoToTripEvent(dto: MomentDto): TripEvent {
  return {
    id: dto.id,
    tripId: dto.tripId,
    dayId: dto.dayId,
    type: dto.type as TripEventType,
    title: dto.title,
    description: dto.description,
    startTime: dto.startTime,
    endTime: dto.endTime,
    placeId: dto.placeId,
    location: dto.location
      ? {
          name: dto.location.name,
          latitude: dto.location.latitude,
          longitude: dto.location.longitude,
        }
      : undefined,
    photoIds: dto.photoIds ?? [],
    photoUrl: dto.photoUrl,
    cloudLinkIds: dto.cloudLinkIds ?? [],
    participantIds: dto.participantIds ?? [],
    tags: dto.tags ?? [],
    order: dto.order,
    amount: dto.amount,
    currency: dto.currency,
    distanceKm: dto.distanceKm,
    elevationGainM: dto.elevationGainM,
    mealType: dto.mealType,
  };
}

export function equipmentDtoToEquipment(dto: EquipmentDto): Equipment {
  return {
    id: dto.id,
    ownerId: dto.ownerId,
    name: dto.name,
    categoryId: dto.categoryId,
    brand: dto.brand,
    model: dto.model,
    weightGrams: dto.weightGrams,
    purchaseDate: dto.purchaseDate,
    purchasePrice: dto.purchasePrice,
    notes: dto.notes,
    photoUrl: dto.photoUrl,
    isActive: dto.isActive,
  };
}

export function categoryDtoToCategory(dto: EquipmentCategoryDto): EquipmentCategory {
  return {
    id: dto.id,
    name: dto.name,
    icon: dto.icon,
    isDefault: dto.isDefault,
    userId: dto.userId,
  };
}

export function tripFormToCreateAdventure(
  values: TripFormValues,
  equipmentIds: string[] = [],
): CreateAdventureRequestDto {
  return {
    title: values.title,
    description: values.description,
    ...(values.coverImageUrl?.trim()
      ? { coverImageUrl: values.coverImageUrl.trim() }
      : {}),
    country: values.country,
    region: values.region,
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    status: values.status,
    visibility: values.visibility,
    adventureType: values.adventureType,
    tags: [],
    equipmentIds,
  };
}

export function tripFormToUpdateAdventure(
  values: TripFormValues,
  equipmentIds: string[] = [],
): UpdateAdventureRequestDto {
  return {
    ...tripFormToCreateAdventure(values, equipmentIds),
    coverImageUrl: values.coverImageUrl?.trim() || "",
    equipmentIds,
  };
}

export function tripDayFormToCreateDay(values: TripDayFormValues): CreateDayRequestDto {
  return {
    date: values.date,
    title: values.title?.trim() || undefined,
    summary: values.description?.trim() || undefined,
    activities: values.activities,
  };
}

export function tripDayFormToUpdateDay(values: TripDayFormValues): CreateDayRequestDto {
  return tripDayFormToCreateDay(values);
}
