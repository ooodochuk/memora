export interface EquipmentCategory {
 id: string;
 name: string;
 icon: string;
 isDefault: boolean;
 userId: string | null;
}

export interface Equipment {
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

/** Join table — trips reference inventory items (no duplication) */
export interface TripEquipment {
 id: string;
 tripId: string;
 equipmentId: string;
}
