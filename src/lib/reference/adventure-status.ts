import type { ReferenceItemDto } from "@/features/reference/types";
import type { AppLocale } from "@/i18n/routing";
import type { TripStatus } from "@/types";

const REF_TO_STATUS: Record<string, TripStatus> = {
  PLANNING: "planning",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

const STATUS_TO_REF: Record<string, string> = {
  planning: "PLANNING",
  draft: "PLANNING",
  published: "IN_PROGRESS",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  archived: "ARCHIVED",
};

export function referenceCodeToTripStatus(code: string): TripStatus {
  return REF_TO_STATUS[code.toUpperCase()] ?? "planning";
}

export function tripStatusToReferenceCode(status: TripStatus | string): string {
  return STATUS_TO_REF[status] ?? status.toUpperCase();
}

export function getReferenceStatusLabel(
  item: ReferenceItemDto,
  locale: AppLocale,
): string {
  return locale === "uk" ? item.nameUk : item.nameEn;
}

export function isArchivedTripStatus(status: TripStatus | string): boolean {
  return status === "archived";
}

export function tripStatusesFromReference(
  items: ReferenceItemDto[],
): TripStatus[] {
  return items.map((item) => referenceCodeToTripStatus(item.code));
}
