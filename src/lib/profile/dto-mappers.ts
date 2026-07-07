import type { ProfileDto } from "@/features/auth/types";
import type { Profile } from "@/types";

export function profileDtoToProfile(dto: ProfileDto): Profile {
  return {
    id: dto.id,
    userId: dto.userId,
    username: dto.username,
    displayName: dto.displayName,
    bio: dto.bio,
    tagline: dto.tagline ?? "",
    avatarUrl: dto.avatarUrl ?? "",
    coverUrl: dto.coverUrl ?? "",
    location: dto.location,
    website: dto.website ?? undefined,
    createdAt: dto.createdAt,
    stats: dto.stats,
  };
}
