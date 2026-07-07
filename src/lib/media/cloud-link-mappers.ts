import type { CloudLinkDto } from "@/features/media/types";
import type { CloudLink, CloudLinkProvider } from "@/types";

const PROVIDER_MAP: Record<string, CloudLinkProvider> = {
  GOOGLE_DRIVE: "GOOGLE_DRIVE",
  ICLOUD: "ICLOUD",
  DROPBOX: "DROPBOX",
  ONEDRIVE: "ONEDRIVE",
  OTHER: "OTHER",
};

export function cloudLinkDtoToCloudLink(dto: CloudLinkDto): CloudLink {
  const provider =
    PROVIDER_MAP[dto.providerCode.toUpperCase()] ?? "OTHER";

  return {
    id: dto.id,
    tripId: dto.adventureId,
    eventId: dto.momentId ?? undefined,
    title: dto.title,
    url: dto.url,
    provider,
    contentType: "other",
    description: dto.notes ?? undefined,
  };
}
