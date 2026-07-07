import { z } from "zod";
import type { Trip } from "@/types";
import type { TripStatus, TripVisibility } from "@/types";
import { ADVENTURE_TYPE_OPTIONS } from "@/lib/adventure-types";

export const TRIP_VISIBILITY_OPTIONS = [
 "public",
 "private",
 "unlisted",
] as const satisfies readonly TripVisibility[];

export const TRIP_STATUS_OPTIONS = [
 "planning",
 "draft",
 "published",
 "in_progress",
 "completed",
 "archived",
] as const satisfies readonly TripStatus[];

export interface TripFormMessages {
 titleRequired: string;
 titleMin: string;
 titleMax: string;
 descriptionRequired: string;
 descriptionMin: string;
 countryRequired: string;
 regionRequired: string;
 startDateRequired: string;
 endDateBeforeStart: string;
 coverUrlRequired: string;
 coverUrlInvalid: string;
 adventureTypeRequired: string;
}

export function createTripFormSchema(messages: TripFormMessages) {
 return z
 .object({
 title: z
 .string()
 .min(1, messages.titleRequired)
 .min(2, messages.titleMin)
 .max(120, messages.titleMax),
 description: z
 .string()
 .min(1, messages.descriptionRequired)
 .min(20, messages.descriptionMin),
 country: z.string().min(1, messages.countryRequired),
 region: z.string().min(1, messages.regionRequired),
 startDate: z.string().min(1, messages.startDateRequired),
 endDate: z.string().optional(),
 coverImageUrl: z
 .string()
 .min(1, messages.coverUrlRequired)
 .url(messages.coverUrlInvalid),
 visibility: z.enum(TRIP_VISIBILITY_OPTIONS),
 status: z.enum(TRIP_STATUS_OPTIONS),
 adventureType: z
 .union([z.enum(ADVENTURE_TYPE_OPTIONS), z.literal("")])
 .refine((value) => value !== "", {
 message: messages.adventureTypeRequired,
 }),
 })
 .refine(
 (data) => {
 if (!data.endDate) return true;
 return new Date(data.endDate) >= new Date(data.startDate);
 },
 { message: messages.endDateBeforeStart, path: ["endDate"] },
 );
}

export type TripFormInputValues = z.input<
 ReturnType<typeof createTripFormSchema>
>;

export type TripFormValues = z.output<
 ReturnType<typeof createTripFormSchema>
>;

export const emptyTripFormValues: TripFormInputValues = {
 title: "",
 description: "",
 country: "",
 region: "",
 startDate: "",
 endDate: "",
 coverImageUrl: "",
 visibility: "private",
 status: "planning",
 adventureType: "",
};

export function tripToFormValues(trip: Trip): TripFormValues {
 return {
 title: trip.title,
 description: trip.description,
 country: trip.country,
 region: trip.region,
 startDate: trip.startDate,
 endDate: trip.endDate ?? "",
 coverImageUrl: trip.coverImageUrl,
 visibility: trip.visibility,
 status: trip.status,
 adventureType: trip.adventureType,
 };
}
