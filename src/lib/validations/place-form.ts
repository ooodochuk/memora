import { z } from "zod";
import type { Place, PlaceCategory } from "@/types";

export const PLACE_CATEGORY_OPTIONS = [
 "HOSTEL",
 "HOTEL",
 "APARTMENT",
 "CAMPSITE",
 "RESTAURANT",
 "CAFE",
 "VIEWPOINT",
 "TRAIL",
 "BEACH",
 "AIRPORT",
 "TRAIN_STATION",
 "PARKING",
 "OTHER",
] as const satisfies readonly PlaceCategory[];

export interface PlaceFormMessages {
 nameRequired: string;
 nameMin: string;
 nameMax: string;
 categoryRequired: string;
 countryRequired: string;
 regionRequired: string;
 addressMax: string;
 latInvalid: string;
 lngInvalid: string;
}

export function createPlaceFormSchema(messages: PlaceFormMessages) {
 const optionalCoord = (invalidMessage: string) =>
 z
 .string()
 .optional()
 .refine(
 (value) =>
 !value ||
 value.trim() === "" ||
 !Number.isNaN(Number.parseFloat(value)),
 { message: invalidMessage },
 );

 return z.object({
 name: z
 .string()
 .min(1, messages.nameRequired)
 .min(2, messages.nameMin)
 .max(120, messages.nameMax),
 category: z.enum(PLACE_CATEGORY_OPTIONS, {
 message: messages.categoryRequired,
 }),
 country: z.string().min(1, messages.countryRequired),
 region: z.string().min(1, messages.regionRequired),
 address: z.string().max(200, messages.addressMax).optional(),
 lat: optionalCoord(messages.latInvalid),
 lng: optionalCoord(messages.lngInvalid),
 });
}

export type PlaceFormValues = z.infer<ReturnType<typeof createPlaceFormSchema>>;

export function emptyPlaceFormValues(
 defaults: Partial<PlaceFormValues> = {},
): PlaceFormValues {
 return {
 name: defaults.name ?? "",
 category: defaults.category ?? "OTHER",
 country: defaults.country ?? "",
 region: defaults.region ?? "",
 address: defaults.address ?? "",
 lat: defaults.lat ?? "",
 lng: defaults.lng ?? "",
 };
}

export function formValuesToPlace(
 values: PlaceFormValues,
 tripId: string,
 existingId?: string,
): Place {
 const lat =
 values.lat?.trim() !== "" ? Number.parseFloat(values.lat!) : undefined;
 const lng =
 values.lng?.trim() !== "" ? Number.parseFloat(values.lng!) : undefined;

 return {
 id: existingId ?? `place-${tripId}-${Date.now()}`,
 tripId,
 name: values.name.trim(),
 category: values.category,
 country: values.country.trim(),
 region: values.region.trim(),
 address: values.address?.trim() || undefined,
 lat,
 lng,
 photoIds: [],
 };
}
