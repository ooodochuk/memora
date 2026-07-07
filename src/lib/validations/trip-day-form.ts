import { z } from "zod";
import type { TripDay } from "@/types";
import {
 DAY_ACTIVITY_OPTIONS,
 MAX_DAY_ACTIVITIES,
 normalizeDayActivities,
} from "@/lib/day-activities";

export interface TripDayFormMessages {
 dateRequired: string;
 titleMax: string;
 descriptionMax: string;
 activitiesMax: string;
}

export function createTripDayFormSchema(messages: TripDayFormMessages) {
 return z.object({
 date: z.string().min(1, messages.dateRequired),
 title: z.string().max(120, messages.titleMax).optional(),
 description: z.string().max(500, messages.descriptionMax).optional(),
 activities: z
 .array(z.enum(DAY_ACTIVITY_OPTIONS))
 .max(MAX_DAY_ACTIVITIES, messages.activitiesMax),
 });
}

export type TripDayFormValues = z.infer<
 ReturnType<typeof createTripDayFormSchema>
>;

export function emptyTripDayFormValues(
 defaults: Partial<TripDayFormValues> = {},
): TripDayFormValues {
 return {
 date: defaults.date ?? "",
 title: defaults.title ?? "",
 description: defaults.description ?? "",
 activities: defaults.activities ?? [],
 };
}

export function tripDayToFormValues(day: TripDay): TripDayFormValues {
 return {
 date: day.date,
 title: day.title ?? "",
 description: day.summary ?? "",
 activities: normalizeDayActivities(day.activities ?? []),
 };
}

export function formValuesToTripDay(
 values: TripDayFormValues,
 tripId: string,
 dayNumber: number,
 existingId?: string,
): TripDay {
 return {
 id: existingId ?? `day-${tripId}-${Date.now()}`,
 tripId,
 dayNumber,
 date: values.date,
 title: values.title?.trim() || undefined,
 summary: values.description?.trim() || undefined,
 activities: values.activities ?? [],
 };
}

export function createNextDayDefaults(
 existingDays: TripDay[],
 tripStartDate: string,
): TripDayFormValues {
 const sorted = [...existingDays].sort((a, b) => a.date.localeCompare(b.date));
 const lastDay = sorted[sorted.length - 1];

 let nextDate = tripStartDate;
 if (lastDay?.date) {
 const d = new Date(`${lastDay.date}T12:00:00`);
 d.setDate(d.getDate() + 1);
 nextDate = d.toISOString().slice(0, 10);
 }

 return emptyTripDayFormValues({ date: nextDate });
}

export function assignDayNumbers(days: TripDay[]): TripDay[] {
 return [...days]
 .sort((a, b) => a.date.localeCompare(b.date))
 .map((day, index) => ({ ...day, dayNumber: index + 1 }));
}
