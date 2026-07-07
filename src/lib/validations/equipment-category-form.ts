import { z } from "zod";
import type { EquipmentCategory } from "@/types";
import { EQUIPMENT_ICON_OPTIONS } from "@/lib/equipment/categories";

export interface EquipmentCategoryFormMessages {
 nameRequired: string;
 nameMin: string;
 nameMax: string;
 iconRequired: string;
}

export function createEquipmentCategoryFormSchema(
 messages: EquipmentCategoryFormMessages,
) {
 return z.object({
 name: z
 .string()
 .min(1, messages.nameRequired)
 .min(2, messages.nameMin)
 .max(48, messages.nameMax),
 icon: z
 .string()
 .min(1, messages.iconRequired)
 .refine(
 (value) =>
 (EQUIPMENT_ICON_OPTIONS as readonly string[]).includes(value),
 { message: messages.iconRequired },
 ),
 });
}

export type EquipmentCategoryFormValues = z.infer<
 ReturnType<typeof createEquipmentCategoryFormSchema>
>;

export const emptyEquipmentCategoryFormValues: EquipmentCategoryFormValues = {
 name: "",
 icon: "Package",
};

export function formValuesToCustomCategory(
 values: EquipmentCategoryFormValues,
 ownerId: string,
 id: string,
): EquipmentCategory {
 return {
 id,
 name: values.name.trim(),
 icon: values.icon,
 isDefault: false,
 userId: ownerId,
 };
}
