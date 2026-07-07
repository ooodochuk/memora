import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse, ApiListResponse } from "@/api/types";
import {
  getActiveEquipmentByOwnerId,
  getEquipmentById,
  getEquipmentByOwnerId,
  getEquipmentIdsByTripId,
} from "@/lib/equipment/accessors";
import { getEquipmentCategoriesForUser } from "@/lib/equipment/category-accessors";
import { getCurrentProfile } from "@/lib/mock-data";
import type { Equipment, EquipmentCategory } from "@/types";
import type {
  CreateEquipmentRequestDto,
  EquipmentCategoryDto,
  EquipmentDto,
  EquipmentInventoryDto,
  TripEquipmentLinkDto,
  UpdateEquipmentRequestDto,
} from "./types";

function toEquipmentDto(item: Equipment): EquipmentDto {
  return { ...item };
}

function toCategoryDto(category: EquipmentCategory): EquipmentCategoryDto {
  return { ...category };
}

export async function fetchEquipmentInventory(): Promise<EquipmentInventoryDto> {
  if (isMockMode()) {
    await mockDelay();
    const profile = getCurrentProfile();
    return {
      items: getEquipmentByOwnerId(profile.id).map(toEquipmentDto),
      categories: getEquipmentCategoriesForUser(profile.id).map(toCategoryDto),
    };
  }

  const response = await apiClient.get<ApiItemResponse<EquipmentInventoryDto>>(
    endpoints.equipment.inventory(),
  );
  return response.data;
}

export async function fetchEquipmentList(): Promise<EquipmentDto[]> {
  const inventory = await fetchEquipmentInventory();
  return inventory.items;
}

export async function fetchEquipmentCategories(): Promise<EquipmentCategoryDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getEquipmentCategoriesForUser(getCurrentProfile().id).map(toCategoryDto);
  }

  const response = await apiClient.get<ApiListResponse<EquipmentCategoryDto>>(
    endpoints.equipment.categories(),
  );
  return response.data;
}

export async function fetchEquipmentItem(id: string): Promise<EquipmentDto> {
  if (isMockMode()) {
    await mockDelay();
    const item = getEquipmentById(id);
    if (!item) throw new Error(`Equipment not found: ${id}`);
    return toEquipmentDto(item);
  }

  const response = await apiClient.get<ApiItemResponse<EquipmentDto>>(
    endpoints.equipment.detail(id),
  );
  return response.data;
}

export async function fetchActiveEquipment(): Promise<EquipmentDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return getActiveEquipmentByOwnerId(getCurrentProfile().id).map(toEquipmentDto);
  }

  const response = await apiClient.get<ApiListResponse<EquipmentDto>>(
    `${endpoints.equipment.list()}?active=true`,
  );
  return response.data;
}

export async function fetchEquipmentByAdventure(
  adventureId: string,
): Promise<EquipmentDto[]> {
  if (isMockMode()) {
    await mockDelay();
    const ids = getEquipmentIdsByTripId(adventureId);
    return ids
      .map((id) => getEquipmentById(id))
      .filter((item): item is Equipment => item !== undefined)
      .map(toEquipmentDto);
  }

  const response = await apiClient.get<ApiListResponse<EquipmentDto>>(
    endpoints.equipment.byAdventure(adventureId),
  );
  return response.data;
}

export async function createEquipment(
  payload: CreateEquipmentRequestDto,
): Promise<EquipmentDto> {
  if (isMockMode()) {
    await mockDelay();
    throw new Error("Mock createEquipment is not implemented — use forms locally.");
  }

  const response = await apiClient.post<ApiItemResponse<EquipmentDto>>(
    endpoints.equipment.create(),
    payload,
  );
  return response.data;
}

export async function updateEquipment(
  id: string,
  payload: UpdateEquipmentRequestDto,
): Promise<EquipmentDto> {
  if (isMockMode()) {
    await mockDelay();
    const item = getEquipmentById(id);
    if (!item) throw new Error(`Equipment not found: ${id}`);
    return toEquipmentDto({ ...item, ...payload });
  }

  const response = await apiClient.patch<ApiItemResponse<EquipmentDto>>(
    endpoints.equipment.update(id),
    payload,
  );
  return response.data;
}

export async function deleteEquipment(id: string): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.delete(endpoints.equipment.delete(id));
}

export async function attachEquipmentToAdventure(
  adventureId: string,
  equipmentId: string,
): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.post(endpoints.equipment.attach(adventureId), { equipmentId });
}

export async function detachEquipmentFromAdventure(
  adventureId: string,
  equipmentId: string,
): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
    return;
  }

  await apiClient.delete(endpoints.equipment.detach(adventureId, equipmentId));
}

export async function syncAdventureEquipment(
  adventureId: string,
  selectedIds: string[],
  currentIds: string[],
): Promise<void> {
  const toAttach = selectedIds.filter((id) => !currentIds.includes(id));
  const toDetach = currentIds.filter((id) => !selectedIds.includes(id));

  await Promise.all([
    ...toAttach.map((equipmentId) =>
      attachEquipmentToAdventure(adventureId, equipmentId),
    ),
    ...toDetach.map((equipmentId) =>
      detachEquipmentFromAdventure(adventureId, equipmentId),
    ),
  ]);
}

/** @deprecated Use fetchEquipmentByAdventure — returns equipment items, not link rows */
export async function fetchTripEquipmentLinks(
  adventureId: string,
): Promise<TripEquipmentLinkDto[]> {
  if (isMockMode()) {
    await mockDelay();
    const ids = getEquipmentIdsByTripId(adventureId);
    return ids.map((equipmentId, index) => ({
      id: `te-${adventureId}-${index}`,
      tripId: adventureId,
      equipmentId,
    }));
  }

  const items = await fetchEquipmentByAdventure(adventureId);
  return items.map((item) => ({
    id: item.id,
    tripId: adventureId,
    equipmentId: item.id,
  }));
}
