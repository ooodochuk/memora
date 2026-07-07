import type { ReferenceItemDto } from "@/features/reference/types";

export const adventureStatusReference: ReferenceItemDto[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    code: "PLANNING",
    nameEn: "Planning",
    nameUk: "Заплановано",
    icon: "calendar-clock",
    sortOrder: 10,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    code: "IN_PROGRESS",
    nameEn: "In progress",
    nameUk: "В процесі",
    icon: "compass",
    sortOrder: 20,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    code: "COMPLETED",
    nameEn: "Completed",
    nameUk: "Завершено",
    icon: "check-circle",
    sortOrder: 30,
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    code: "ARCHIVED",
    nameEn: "Archived",
    nameUk: "В архіві",
    icon: "archive",
    sortOrder: 40,
  },
];
