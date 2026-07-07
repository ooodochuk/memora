import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse, ApiListResponse } from "@/api/types";
import { getDayById, getDaysByTripId } from "@/lib/mock-data";
import type { TripDay } from "@/types";
import type { CreateDayRequestDto, DayDto, UpdateDayRequestDto } from "./types";

function toDayDto(day: TripDay): DayDto {
  return {
    id: day.id,
    tripId: day.tripId,
    dayNumber: day.dayNumber,
    date: day.date,
    title: day.title,
    summary: day.summary,
    coverImageUrl: day.coverImageUrl,
    activities: day.activities,
  };
}

export async function fetchDaysByAdventure(adventureId: string): Promise<DayDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getDaysByTripId(adventureId).map(toDayDto);
  }

  const response = await apiClient.get<ApiListResponse<DayDto>>(
    endpoints.days.byAdventure(adventureId),
  );
  return response.data;
}

export async function fetchDay(dayId: string): Promise<DayDto> {
  if (isMockMode()) {
    await mockDelay();
    const day = getDayById(dayId);
    if (!day) throw new Error(`Day not found: ${dayId}`);
    return toDayDto(day);
  }

  const response = await apiClient.get<ApiItemResponse<DayDto>>(
    endpoints.days.detail(dayId),
  );
  return response.data;
}

export async function createDay(
  adventureId: string,
  payload: CreateDayRequestDto,
): Promise<DayDto> {
  if (isMockMode()) {
    await mockDelay();
    throw new Error("Mock createDay is not implemented — use forms locally.");
  }

  const response = await apiClient.post<ApiItemResponse<DayDto>>(
    endpoints.days.create(adventureId),
    payload,
  );
  return response.data;
}

export async function updateDay(
  dayId: string,
  payload: UpdateDayRequestDto,
): Promise<DayDto> {
  if (isMockMode()) {
    await mockDelay();
    const day = getDayById(dayId);
    if (!day) throw new Error(`Day not found: ${dayId}`);
    return toDayDto({ ...day, ...payload });
  }

  const response = await apiClient.patch<ApiItemResponse<DayDto>>(
    endpoints.days.update(dayId),
    payload,
  );
  return response.data;
}

export async function deleteDay(dayId: string): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.delete(endpoints.days.delete(dayId));
}
