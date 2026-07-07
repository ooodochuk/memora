import type { PublicProfileDto } from "@/features/public/types";
import type { Profile } from "@/types";

export function publicProfileDtoToProfile(dto: PublicProfileDto): Profile {
  return {
    id: dto.id,
    userId: dto.id,
    username: dto.username,
    displayName: dto.displayName,
    bio: dto.bio,
    tagline: dto.tagline ?? "",
    avatarUrl: dto.avatarUrl ?? "",
    coverUrl: dto.coverUrl ?? "",
    location: dto.location,
    website: dto.website ?? undefined,
    createdAt: dto.createdAt,
    stats: { tripCount: 0 },
  };
}
