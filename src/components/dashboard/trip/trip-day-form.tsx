"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { TripDay } from "@/types";
import {
  createTripDayFormSchema,
  emptyTripDayFormValues,
  formValuesToTripDay,
  tripDayToFormValues,
  type TripDayFormValues,
} from "@/lib/validations/trip-day-form";
import { DayActivityPicker } from "@/components/day-activities";
import { FormField } from "@/components/design-system/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TripDayFormProps {
  formId?: string;
  tripId: string;
  editingDay?: TripDay | null;
  defaultValues?: TripDayFormValues;
  dayNumber: number;
  onSubmit: (day: TripDay) => void;
}

export function TripDayForm({
  formId = "trip-day-form",
  tripId,
  editingDay,
  defaultValues,
  dayNumber,
  onSubmit,
}: TripDayFormProps) {
  const t = useTranslations("dashboard.tripDayForm");

  const schema = useMemo(
    () =>
      createTripDayFormSchema({
        dateRequired: t("errors.dateRequired"),
        titleMax: t("errors.titleMax"),
        descriptionMax: t("errors.descriptionMax"),
        activitiesMax: t("errors.activitiesMax"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TripDayFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? emptyTripDayFormValues(),
  });

  useEffect(() => {
    if (editingDay) {
      reset(tripDayToFormValues(editingDay));
    } else if (defaultValues) {
      reset(defaultValues);
    } else {
      reset(emptyTripDayFormValues());
    }
  }, [editingDay, defaultValues, reset]);

  function handleFormSubmit(values: TripDayFormValues) {
    const day = formValuesToTripDay(
      values,
      tripId,
      editingDay?.dayNumber ?? dayNumber,
      editingDay?.id,
    );
    onSubmit(day);
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5"
    >
      <FormField
        label={t("fields.date.label")}
        htmlFor="date"
        error={errors.date?.message}
      >
        <Input
          id="date"
          type="date"
          className="h-11"
          {...register("date")}
          aria-invalid={!!errors.date}
        />
      </FormField>

      <FormField
        label={t("fields.title.label")}
        htmlFor="title"
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder={t("fields.title.placeholder")}
          className="h-11 font-heading"
          {...register("title")}
          aria-invalid={!!errors.title}
        />
      </FormField>

      <FormField label={t("fields.activities.label")} htmlFor="day-activities">
        <Controller
          name="activities"
          control={control}
          render={({ field }) => (
            <DayActivityPicker
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField
        label={t("fields.description.label")}
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={3}
          placeholder={t("fields.description.placeholder")}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
      </FormField>
    </form>
  );
}
