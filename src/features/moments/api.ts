import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse, ApiListResponse } from "@/api/types";
import { getEventById, getEventsByDayId, getEventsByTripId } from "@/lib/mock-data";
import type { TripEvent } from "@/types";
import type {
  CreateMomentRequestDto,
  MomentDto,
  UpdateMomentRequestDto,
} from "./types";

function toMomentDto(event: TripEvent): MomentDto {
  return {
    id: event.id,
    tripId: event.tripId,
    dayId: event.dayId,
    type: event.type,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    placeId: event.placeId,
    location: event.location,
    photoIds: event.photoIds,
    cloudLinkIds: event.cloudLinkIds,
    participantIds: event.participantIds,
    tags: event.tags,
    order: event.order,
    amount: event.amount,
    currency: event.currency,
    distanceKm: event.distanceKm,
    elevationGainM: event.elevationGainM,
    mealType: event.mealType,
  };
}

export async function fetchMomentsByDay(dayId: string): Promise<MomentDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getEventsByDayId(dayId).map(toMomentDto);
  }

  const response = await apiClient.get<ApiListResponse<MomentDto>>(
    endpoints.moments.byDay(dayId),
  );
  return response.data;
}

export async function fetchMomentsByAdventure(
  adventureId: string,
): Promise<MomentDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getEventsByTripId(adventureId).map(toMomentDto);
  }

  const response = await apiClient.get<ApiListResponse<MomentDto>>(
    endpoints.moments.byAdventure(adventureId),
  );
  return response.data;
}

export async function fetchMoment(momentId: string): Promise<MomentDto> {
  if (isMockMode()) {
    await mockDelay();
    const event = getEventById(momentId);
    if (!event) throw new Error(`Moment not found: ${momentId}`);
    return toMomentDto(event);
  }

  const response = await apiClient.get<ApiItemResponse<MomentDto>>(
    endpoints.moments.detail(momentId),
  );
  return response.data;
}

export async function createMoment(
  dayId: string,
  payload: CreateMomentRequestDto,
): Promise<MomentDto> {
  if (isMockMode()) {
    await mockDelay();
    throw new Error("Mock createMoment is not implemented — use forms locally.");
  }

  const response = await apiClient.post<ApiItemResponse<MomentDto>>(
    endpoints.moments.create(dayId),
    payload,
  );
  return response.data;
}

export async function updateMoment(
  momentId: string,
  payload: UpdateMomentRequestDto,
): Promise<MomentDto> {
  if (isMockMode()) {
    await mockDelay();
    const event = getEventById(momentId);
    if (!event) throw new Error(`Moment not found: ${momentId}`);
    return toMomentDto({ ...event, ...payload });
  }

  const response = await apiClient.patch<ApiItemResponse<MomentDto>>(
    endpoints.moments.update(momentId),
    payload,
  );
  return response.data;
}

export async function deleteMoment(momentId: string): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.delete(endpoints.moments.delete(momentId));
}
