import { z } from "zod";
import type { Equipment } from "@/types";

export interface EquipmentFormMessages {
 nameRequired: string;
 brandRequired: string;
 modelRequired: string;
 categoryRequired: string;
 weightMin: string;
 weightMax: string;
 priceMin: string;
 photoUrlInvalid: string;
}

export function createEquipmentFormSchema(messages: EquipmentFormMessages) {
 return z.object({
 name: z.string().min(1, messages.nameRequired),
 categoryId: z.string().min(1, messages.categoryRequired),
 brand: z.string().min(1, messages.brandRequired),
 model: z.string().min(1, messages.modelRequired),
 weightGrams: z
 .number({ message: messages.weightMin })
 .int()
 .min(1, messages.weightMin)
 .max(50000, messages.weightMax),
 purchaseDate: z.string().optional(),
 purchasePrice: z
 .number()
 .min(0, messages.priceMin)
 .optional()
 .or(z.nan().transform(() => undefined)),
 notes: z.string().optional(),
 photoUrl: z
 .string()
 .optional()
 .refine((value) => !value || z.string().url().safeParse(value).success, {
 message: messages.photoUrlInvalid,
 }),
 isActive: z.boolean(),
 });
}

export type EquipmentFormValues = z.infer<
 ReturnType<typeof createEquipmentFormSchema>
>;

export const emptyEquipmentFormValues: EquipmentFormValues = {
 name: "",
 categoryId: "",
 brand: "",
 model: "",
 weightGrams: 0,
 purchaseDate: "",
 purchasePrice: undefined,
 notes: "",
 photoUrl: "",
 isActive: true,
};

export function equipmentToFormValues(item: Equipment): EquipmentFormValues {
 return {
 name: item.name,
 categoryId: item.categoryId,
 brand: item.brand,
 model: item.model,
 weightGrams: item.weightGrams,
 purchaseDate: item.purchaseDate ?? "",
 purchasePrice: item.purchasePrice,
 notes: item.notes ?? "",
 photoUrl: item.photoUrl ?? "",
 isActive: item.isActive,
 };
}
