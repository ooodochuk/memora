import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse } from "@/api/types";
import type { ProfileDto, UpdateProfileRequestDto } from "@/features/auth/types";
import { getCurrentProfile } from "@/lib/mock-data";

export async function updateProfile(
  payload: UpdateProfileRequestDto,
): Promise<ProfileDto> {
  if (isMockMode()) {
    await mockDelay();
    const profile = getCurrentProfile();
    return {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      displayName: payload.displayName ?? profile.displayName,
      bio: payload.bio ?? profile.bio,
      tagline: payload.tagline ?? profile.tagline ?? "",
      avatarUrl: profile.avatarUrl,
      coverUrl: profile.coverUrl,
      location: payload.location ?? profile.location,
      website: payload.website ?? profile.website,
      createdAt: profile.createdAt,
      stats: profile.stats,
    };
  }

  const response = await apiClient.patch<ApiItemResponse<ProfileDto>>(
    endpoints.auth.profile(),
    payload,
  );
  return response.data;
}
