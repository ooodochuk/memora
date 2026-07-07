/** Backend equipment contract */
export interface EquipmentDto {
  id: string;
  ownerId: string;
  name: string;
  categoryId: string;
  brand: string;
  model: string;
  weightGrams: number;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  photoUrl?: string;
  isActive: boolean;
}

export interface EquipmentCategoryDto {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
  userId: string | null;
}

export interface EquipmentInventoryDto {
  items: EquipmentDto[];
  categories: EquipmentCategoryDto[];
}

export interface CreateEquipmentRequestDto {
  name: string;
  categoryId: string;
  brand: string;
  model: string;
  weightGrams: number;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  photoUrl?: string;
  isActive?: boolean;
}

export type UpdateEquipmentRequestDto = Partial<CreateEquipmentRequestDto>;

export interface TripEquipmentLinkDto {
  id: string;
  tripId: string;
  equipmentId: string;
}
