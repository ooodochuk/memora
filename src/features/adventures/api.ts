import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse, ApiListResponse } from "@/api/types";
import {
  getCloudLinksByTripId,
  getDashboardHomeData,
  getTripById,
  getTripsByOwnerId,
} from "@/lib/mock-data";
import { getCurrentProfile } from "@/lib/mock-data";
import type { Trip } from "@/types";
import type {
  AdventureDto,
  AdventureSummaryDto,
  DashboardHomeDto,
  CreateAdventureRequestDto,
  UpdateAdventureRequestDto,
} from "./types";

function toAdventureDto(trip: Trip): AdventureDto {
  return {
    id: trip.id,
    slug: trip.slug,
    ownerId: trip.ownerId,
    title: trip.title,
    subtitle: trip.subtitle,
    description: trip.description,
    coverImageUrl: trip.coverImageUrl,
    country: trip.country,
    region: trip.region,
    startDate: trip.startDate,
    endDate: trip.endDate,
    status: trip.status,
    visibility: trip.visibility,
    tags: trip.tags,
    adventureType: trip.adventureType,
    stats: trip.stats,
  };
}

export async function fetchAdventures(): Promise<AdventureDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getTripsByOwnerId(getCurrentProfile().id).map(toAdventureDto);
  }

  const response = await apiClient.get<ApiListResponse<AdventureDto>>(
    endpoints.adventures.list(),
  );
  return response.data;
}

export async function fetchAdventure(id: string): Promise<AdventureDto> {
  if (isMockMode()) {
    await mockDelay();
    const trip = getTripById(id);
    if (!trip) throw new Error(`Adventure not found: ${id}`);
    return toAdventureDto(trip);
  }

  const response = await apiClient.get<ApiItemResponse<AdventureDto>>(
    endpoints.adventures.detail(id),
  );
  return response.data;
}

export async function fetchAdventureSummaries(): Promise<AdventureSummaryDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getTripsByOwnerId(getCurrentProfile().id).map((trip) => ({
      adventure: toAdventureDto(trip),
      cloudLinkCount: getCloudLinksByTripId(trip.id).length,
    }));
  }

  const response = await apiClient.get<ApiListResponse<AdventureSummaryDto>>(
    endpoints.adventures.summaries(),
  );
  return response.data;
}

export async function fetchDashboardHome(): Promise<DashboardHomeDto> {
  if (isMockMode()) {
    await mockDelay();
    return getDashboardHomeData(getCurrentProfile().id);
  }

  const response = await apiClient.get<ApiItemResponse<DashboardHomeDto>>(
    endpoints.adventures.dashboard(),
  );
  return response.data;
}

export async function createAdventure(
  payload: CreateAdventureRequestDto,
): Promise<AdventureDto> {
  if (isMockMode()) {
    await mockDelay();
    throw new Error("Mock createAdventure is not implemented — use forms locally.");
  }

  const response = await apiClient.post<ApiItemResponse<AdventureDto>>(
    endpoints.adventures.create(),
    payload,
  );
  return response.data;
}

export async function updateAdventure(
  id: string,
  payload: UpdateAdventureRequestDto,
): Promise<AdventureDto> {
  if (isMockMode()) {
    await mockDelay();
    const trip = getTripById(id);
    if (!trip) throw new Error(`Adventure not found: ${id}`);
    return toAdventureDto({ ...trip, ...payload });
  }

  const response = await apiClient.patch<ApiItemResponse<AdventureDto>>(
    endpoints.adventures.update(id),
    payload,
  );
  return response.data;
}

export async function deleteAdventure(id: string): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.delete(endpoints.adventures.delete(id));
}
