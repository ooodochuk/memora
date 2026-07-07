import { z } from "zod";
import type { TripEvent, TripEventLocation } from "@/types";
import type { MealType, TripEventType } from "@/types";

export const TRIP_EVENT_MODAL_TYPE_OPTIONS = [
 "SLEEP",
 "FOOD",
 "HIKE",
 "BIKE",
 "TRANSPORT",
 "PLACE_VISIT",
 "PHOTO_VIDEO",
 "EXPENSE",
 "NOTE",
 "TIP",
] as const satisfies readonly TripEventType[];

export const MEAL_TYPE_OPTIONS = [
 "BREAKFAST",
 "LUNCH",
 "DINNER",
 "SNACK",
 "OTHER",
] as const satisfies readonly MealType[];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function optionalMetricField(message: string) {
  return z.number().min(0, message).optional().catch(undefined);
}

const locationSchema = z.object({
 name: z.string().optional(),
 latitude: z.number(),
 longitude: z.number(),
});

export interface TripEventModalFormMessages {
 typeRequired: string;
 titleRequired: string;
 titleMin: string;
 titleMax: string;
 startTimeInvalid: string;
 endTimeInvalid: string;
 endTimeBeforeStart: string;
 distanceMin: string;
 elevationMin: string;
}

export function createTripEventModalFormSchema(
 messages: TripEventModalFormMessages,
) {
 const optionalTime = z
 .string()
 .optional()
 .refine((value) => !value || TIME_PATTERN.test(value), {
 message: messages.startTimeInvalid,
 });

 return z
 .object({
 type: z.enum(TRIP_EVENT_MODAL_TYPE_OPTIONS, {
 message: messages.typeRequired,
 }),
 title: z
 .string()
 .min(1, messages.titleRequired)
 .min(2, messages.titleMin)
 .max(120, messages.titleMax),
 description: z.string().optional(),
 startTime: optionalTime,
 endTime: z
 .string()
 .optional()
 .refine((value) => !value || TIME_PATTERN.test(value), {
 message: messages.endTimeInvalid,
 }),
 location: locationSchema.nullable().optional(),
 mealType: z.enum(MEAL_TYPE_OPTIONS).optional(),
 distanceKm: optionalMetricField(messages.distanceMin),
 elevationGainM: optionalMetricField(messages.elevationMin),
 })
 .refine(
 (data) => {
 if (!data.startTime || !data.endTime) return true;
 return data.endTime >= data.startTime;
 },
 { message: messages.endTimeBeforeStart, path: ["endTime"] },
 );
}

export type TripEventModalFormValues = z.infer<
 ReturnType<typeof createTripEventModalFormSchema>
>;

export function emptyTripEventModalFormValues(
 defaults: Partial<TripEventModalFormValues> = {},
): TripEventModalFormValues {
 return {
 type: defaults.type ?? "NOTE",
 title: defaults.title ?? "",
 description: defaults.description ?? "",
 startTime: defaults.startTime ?? "",
 endTime: defaults.endTime ?? "",
 location: defaults.location ?? null,
 mealType: defaults.mealType,
 distanceKm: defaults.distanceKm,
 elevationGainM: defaults.elevationGainM,
 };
}

export function eventToModalFormValues(
 event: TripEvent,
): TripEventModalFormValues {
 return {
 type: event.type,
 title: event.title,
 description: event.description ?? "",
 startTime: event.startTime ?? "",
 endTime: event.endTime ?? "",
 location: event.location ?? null,
 mealType: event.mealType,
 distanceKm: event.distanceKm,
 elevationGainM: event.elevationGainM,
 };
}

function normalizeLocation(
 location: TripEventLocation | null | undefined,
): TripEventLocation | undefined {
 if (!location) return undefined;
 return {
 name: location.name?.trim() || undefined,
 latitude: location.latitude,
 longitude: location.longitude,
 };
}

export function formValuesToTripEvent(
 values: TripEventModalFormValues,
 options: {
 tripId: string;
 dayId: string;
 order: number;
 existingId?: string;
 cloudLinkIds?: string[];
 photoIds?: string[];
 },
): TripEvent {
 return {
 id: options.existingId ?? `event-${options.dayId}-${Date.now()}`,
 tripId: options.tripId,
 dayId: options.dayId,
 type: values.type,
 title: values.title.trim(),
 description: values.description?.trim() || undefined,
 startTime: values.startTime?.trim() || undefined,
 endTime: values.endTime?.trim() || undefined,
 location: normalizeLocation(values.location),
 mealType: values.type === "FOOD" ? values.mealType : undefined,
 distanceKm: eventFormShowsDistance(values.type) && values.distanceKm != null
 ? values.distanceKm
 : undefined,
 elevationGainM: eventFormShowsDistance(values.type) && values.elevationGainM != null
 ? values.elevationGainM
 : undefined,
 photoIds: options.photoIds ?? [],
 cloudLinkIds: options.cloudLinkIds ?? [],
 participantIds: [],
 tags: [],
 order: options.order,
 };
}

export function eventHasAdvancedDetails(
 values: TripEventModalFormValues,
 cloudLinkCount = 0,
): boolean {
 return Boolean(
 values.startTime?.trim() ||
 values.endTime?.trim() ||
 values.mealType ||
 values.distanceKm != null ||
 values.elevationGainM != null ||
 cloudLinkCount > 0,
 );
}

export function eventFormShowsMealType(type: TripEventType): boolean {
 return type === "FOOD";
}

export function eventFormShowsDistance(type: TripEventType): boolean {
 return type === "HIKE" || type === "BIKE" || type === "TRANSPORT";
}

export function eventFormShowsCloudLinks(type: TripEventType): boolean {
 return type === "PHOTO_VIDEO";
}

export function eventFormUsesCheckInLabels(type: TripEventType): boolean {
 return type === "SLEEP";
}

export function createDefaultModalFormValues(options: {
 type?: TripEventType;
}): TripEventModalFormValues {
 return emptyTripEventModalFormValues({
 type: options.type ?? "NOTE",
 });
}
