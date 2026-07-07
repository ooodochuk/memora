import { z } from "zod";
import type { Trip, TripEvent } from "@/types";
import type { TripEventType, TripVisibility } from "@/types";
import { TRIP_VISIBILITY_OPTIONS } from "@/lib/validations/trip-form";

export const TRIP_EVENT_TYPE_OPTIONS = [
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

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export interface TripEventFormMessages {
 typeRequired: string;
 titleRequired: string;
 titleMin: string;
 titleMax: string;
 startTimeInvalid: string;
 endTimeInvalid: string;
 endTimeBeforeStart: string;
 orderMin: string;
}

export function createTripEventFormSchema(messages: TripEventFormMessages) {
 const optionalTime = z
 .string()
 .optional()
 .refine((value) => !value || TIME_PATTERN.test(value), {
 message: messages.startTimeInvalid,
 });

 return z
 .object({
 type: z.enum(TRIP_EVENT_TYPE_OPTIONS, {
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
 placeId: z.string().optional(),
 visibility: z.enum(TRIP_VISIBILITY_OPTIONS),
 order: z
 .number({ message: messages.orderMin })
 .int()
 .min(1, messages.orderMin),
 })
 .refine(
 (data) => {
 if (!data.startTime || !data.endTime) return true;
 return data.endTime >= data.startTime;
 },
 { message: messages.endTimeBeforeStart, path: ["endTime"] },
 );
}

export type TripEventFormValues = z.infer<
 ReturnType<typeof createTripEventFormSchema>
>;

export const emptyTripEventFormValues: TripEventFormValues = {
 type: "NOTE",
 title: "",
 description: "",
 startTime: "",
 endTime: "",
 placeId: "",
 visibility: "private",
 order: 1,
};

export function eventToFormValues(
 event: TripEvent,
 trip: Trip,
): TripEventFormValues {
 return {
 type: event.type,
 title: event.title,
 description: event.description ?? "",
 startTime: event.startTime ?? "",
 endTime: event.endTime ?? "",
 placeId: event.placeId ?? "",
 visibility: trip.visibility,
 order: event.order,
 };
}

export function createDefaultEventFormValues(options: {
 order?: number;
 visibility?: TripVisibility;
 type?: TripEventType;
}): TripEventFormValues {
 return {
 ...emptyTripEventFormValues,
 order: options.order ?? 1,
 visibility: options.visibility ?? "private",
 type: options.type ?? "NOTE",
 };
}
