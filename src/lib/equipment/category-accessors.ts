import type { EquipmentCategory } from "@/types";
import {
 customEquipmentCategories,
 defaultEquipmentCategories,
 equipmentCategories,
} from "@/lib/mock-data/equipment-categories";

export function getAllEquipmentCategories(): EquipmentCategory[] {
 return equipmentCategories;
}

export function getDefaultEquipmentCategories(): EquipmentCategory[] {
 return defaultEquipmentCategories;
}

export function getCustomEquipmentCategoriesByUserId(
 userId: string,
): EquipmentCategory[] {
 return customEquipmentCategories.filter(
 (category) => category.userId === userId,
 );
}

/** Default categories plus categories owned by the user */
export function getEquipmentCategoriesForUser(userId: string): EquipmentCategory[] {
 return [
 ...defaultEquipmentCategories,
 ...getCustomEquipmentCategoriesByUserId(userId),
 ];
}

export function getEquipmentCategoryById(
 id: string,
): EquipmentCategory | undefined {
 return equipmentCategories.find((category) => category.id === id);
}

export function buildEquipmentCategoryMap(
 categories: EquipmentCategory[],
): Map<string, EquipmentCategory> {
 return new Map(categories.map((category) => [category.id, category]));
}

export function createCustomEquipmentCategoryId(): string {
 return `ecat-custom-${Date.now()}`;
}
