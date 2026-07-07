import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import { adventureStatusReference } from "@/lib/mock-data/reference";
import type { ApiListResponse } from "@/api/types";
import type { ReferenceItemDto } from "./types";

export async function fetchAdventureStatuses(): Promise<ReferenceItemDto[]> {
  if (isMockMode()) {
    await mockDelay();
    return adventureStatusReference;
  }

  const response = await apiClient.get<ApiListResponse<ReferenceItemDto>>(
    endpoints.reference.adventureStatuses(),
  );
  return response.data;
}
