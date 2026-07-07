import type { PublicEquipmentDto } from "@/features/public/types";

export interface PublicTripEquipmentItem {
  id: string;
  name: string;
  categoryIcon: string;
  brand: string;
  model: string;
  weightGrams?: number;
  photoUrl?: string;
  notes?: string;
}

export function publicEquipmentDtoToItem(
  dto: PublicEquipmentDto,
): PublicTripEquipmentItem {
  return {
    id: dto.id,
    name: dto.name,
    categoryIcon: dto.category,
    brand: dto.brand,
    model: dto.model,
    weightGrams: dto.weightGrams > 0 ? dto.weightGrams : undefined,
    photoUrl: dto.photoUrl,
    notes: dto.notes,
  };
}
