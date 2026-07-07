import type { EquipmentCategory } from "@/types";

/** Default category ids — stable references for mock data and i18n keys */
export const DEFAULT_EQUIPMENT_CATEGORY_IDS = {
 TENT: "ecat-tent",
 SLEEPING_BAG: "ecat-sleeping-bag",
 SLEEPING_PAD: "ecat-sleeping-pad",
 BACKPACK: "ecat-backpack",
 BIKE: "ecat-bike",
 HELMET: "ecat-helmet",
 STOVE: "ecat-stove",
 DRONE: "ecat-drone",
 ACTION_CAMERA: "ecat-action-camera",
 CAMERA: "ecat-camera",
 SHOES: "ecat-shoes",
 JACKET: "ecat-jacket",
 POWER_BANK: "ecat-power-bank",
 WATER_FILTER: "ecat-water-filter",
 TREKKING_POLES: "ecat-trekking-poles",
 FIRST_AID_KIT: "ecat-first-aid-kit",
 OTHER: "ecat-other",
} as const;

export const defaultEquipmentCategories: EquipmentCategory[] = [
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.TENT,
 name: "Tent",
 icon: "Tent",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.SLEEPING_BAG,
 name: "Sleeping Bag",
 icon: "BedDouble",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.SLEEPING_PAD,
 name: "Sleeping Pad",
 icon: "Layers",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.BACKPACK,
 name: "Backpack",
 icon: "Backpack",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.BIKE,
 name: "Bike",
 icon: "Bike",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.HELMET,
 name: "Helmet",
 icon: "HardHat",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.STOVE,
 name: "Stove",
 icon: "Flame",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.DRONE,
 name: "Drone",
 icon: "Plane",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.ACTION_CAMERA,
 name: "Action Camera",
 icon: "Video",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.CAMERA,
 name: "Camera",
 icon: "Camera",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.SHOES,
 name: "Shoes",
 icon: "Footprints",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.JACKET,
 name: "Jacket",
 icon: "Shirt",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.POWER_BANK,
 name: "Power Bank",
 icon: "Battery",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.WATER_FILTER,
 name: "Water Filter",
 icon: "Droplets",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.TREKKING_POLES,
 name: "Trekking Poles",
 icon: "Mountain",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.FIRST_AID_KIT,
 name: "First Aid Kit",
 icon: "Cross",
 isDefault: true,
 userId: null,
 },
 {
 id: DEFAULT_EQUIPMENT_CATEGORY_IDS.OTHER,
 name: "Other",
 icon: "Package",
 isDefault: true,
 userId: null,
 },
];

/** User-created categories — scoped to ownerId */
export const customEquipmentCategories: EquipmentCategory[] = [
 {
 id: "ecat-custom-gps-watch",
 name: "GPS Watch",
 icon: "Watch",
 isDefault: false,
 userId: "profile-oksana",
 },
];

export const equipmentCategories: EquipmentCategory[] = [
 ...defaultEquipmentCategories,
 ...customEquipmentCategories,
];
