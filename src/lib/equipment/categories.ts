import {
 Backpack,
 Battery,
 BedDouble,
 Bike,
 Camera,
 Compass,
 Cross,
 Droplets,
 Flame,
 Footprints,
 HardHat,
 Layers,
 Map,
 Mountain,
 Package,
 Plane,
 Radio,
 Shirt,
 Tent,
 Video,
 Watch,
 type LucideIcon,
} from "lucide-react";

const EQUIPMENT_ICON_MAP: Record<string, LucideIcon> = {
 Tent,
 BedDouble,
 Layers,
 Backpack,
 Bike,
 HardHat,
 Flame,
 Plane,
 Video,
 Camera,
 Footprints,
 Shirt,
 Battery,
 Droplets,
 Mountain,
 Cross,
 Package,
 Watch,
 Compass,
 Map,
 Radio,
};

/** Icons available when creating a custom category */
export const EQUIPMENT_ICON_OPTIONS = [
 "Tent",
 "BedDouble",
 "Layers",
 "Backpack",
 "Bike",
 "HardHat",
 "Flame",
 "Plane",
 "Video",
 "Camera",
 "Footprints",
 "Shirt",
 "Battery",
 "Droplets",
 "Mountain",
 "Cross",
 "Package",
 "Watch",
 "Compass",
 "Map",
 "Radio",
] as const;

export function resolveEquipmentIcon(iconName: string): LucideIcon {
 return EQUIPMENT_ICON_MAP[iconName] ?? Package;
}

export function formatWeightGrams(grams: number): string {
 if (grams >= 1000) {
 const kg = grams / 1000;
 return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`;
 }
 return `${grams} g`;
}

export function formatPrice(amount: number, locale: string): string {
 return new Intl.NumberFormat(locale, {
 style: "currency",
 currency: "EUR",
 maximumFractionDigits: 0,
 }).format(amount);
}

export function getEquipmentCategoryLabel(
 category: { id: string; name: string; isDefault: boolean },
 tDefault: (id: string) => string,
): string {
 if (category.isDefault) {
 const translated = tDefault(category.id);
 if (translated !== category.id && !translated.includes(category.id)) {
 return translated;
 }
 }
 return category.name;
}
