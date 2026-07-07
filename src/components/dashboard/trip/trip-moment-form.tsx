"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { CloudLink, Photo, TripEvent } from "@/types";
import { CloudLinkList } from "@/components/cloud-links";
import { EventTypeQuickPicker } from "@/components/dashboard/trip/event-type-quick-picker";
import { MomentLocationPicker, MomentPhotoPicker } from "@/components/moments";
import {
  MEAL_TYPE_OPTIONS,
  createDefaultModalFormValues,
  createTripEventModalFormSchema,
  emptyTripEventModalFormValues,
  eventFormShowsCloudLinks,
  eventFormShowsDistance,
  eventFormShowsMealType,
  eventFormUsesCheckInLabels,
  eventHasAdvancedDetails,
  eventToModalFormValues,
  formValuesToTripEvent,
  type TripEventModalFormValues,
} from "@/lib/validations/trip-event-modal-form";
import { FormField } from "@/components/design-system/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TripMomentFormProps {
  formId?: string;
  tripId: string;
  dayId: string;
  editingEvent?: TripEvent | null;
  initialCloudLinks?: CloudLink[];
  initialPhotos?: Photo[];
  nextOrder: number;
  onSubmit: (payload: {
    event: TripEvent;
    cloudLinks: CloudLink[];
    photos: Photo[];
  }) => void | Promise<void>;
}

export function TripMomentForm({
  formId = "trip-moment-form",
  tripId,
  dayId,
  editingEvent,
  initialCloudLinks = [],
  initialPhotos = [],
  nextOrder,
  onSubmit,
}: TripMomentFormProps) {
  const t = useTranslations("dashboard.tripEventModal");
  const tMeals = useTranslations("event.mealTypes");

  const [cloudLinks, setCloudLinks] = useState(initialCloudLinks);
  const [momentPhotos, setMomentPhotos] = useState<Photo[]>(initialPhotos);
  const [draftEventId, setDraftEventId] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const schema = useMemo(
    () =>
      createTripEventModalFormSchema({
        typeRequired: t("errors.typeRequired"),
        titleRequired: t("errors.titleRequired"),
        titleMin: t("errors.titleMin"),
        titleMax: t("errors.titleMax"),
        startTimeInvalid: t("errors.startTimeInvalid"),
        endTimeInvalid: t("errors.endTimeInvalid"),
        endTimeBeforeStart: t("errors.endTimeBeforeStart"),
        distanceMin: t("errors.distanceMin"),
        elevationMin: t("errors.elevationMin"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripEventModalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: createDefaultModalFormValues({}),
  });

  const eventType = watch("type");
  const showMeal = eventFormShowsMealType(eventType);
  const showDistance = eventFormShowsDistance(eventType);
  const showCloudLinks = eventFormShowsCloudLinks(eventType);
  const sleepLabels = eventFormUsesCheckInLabels(eventType);

  useEffect(() => {
    setCloudLinks(initialCloudLinks);
    setMomentPhotos(initialPhotos);
    setDraftEventId(editingEvent?.id ?? `event-${dayId}-${Date.now()}`);

    if (editingEvent) {
      const values = eventToModalFormValues(editingEvent);
      reset(values);
      setShowAdvanced(
        eventHasAdvancedDetails(values, initialCloudLinks.length),
      );
    } else {
      reset(emptyTripEventModalFormValues());
      setShowAdvanced(false);
    }
  }, [editingEvent, initialCloudLinks, initialPhotos, dayId, reset]);

  useEffect(() => {
    if (!eventFormShowsDistance(eventType)) {
      setValue("distanceKm", undefined);
      setValue("elevationGainM", undefined);
    }
    if (!eventFormShowsMealType(eventType)) {
      setValue("mealType", undefined);
    }
  }, [eventType, setValue]);

  async function handleFormSubmit(values: TripEventModalFormValues) {
    setShowValidationAlert(false);
    const linkIds = cloudLinks.map((link) => link.id);
    const event = formValuesToTripEvent(values, {
      tripId,
      dayId,
      order: editingEvent?.order ?? nextOrder,
      existingId: draftEventId,
      cloudLinkIds:
        showCloudLinks && cloudLinks.length > 0
          ? linkIds
          : (editingEvent?.cloudLinkIds ?? []),
      photoIds: momentPhotos.map((photo) => photo.id),
    });

    await onSubmit({
      event,
      cloudLinks: showCloudLinks
        ? cloudLinks.map((link) => ({ ...link, eventId: event.id, tripId }))
        : [],
      photos: momentPhotos.map((photo) => ({
        ...photo,
        eventId: event.id,
        tripId,
      })),
    });
  }

  function handleInvalidSubmit(invalidErrors: typeof errors) {
    setShowValidationAlert(true);
    if (
      invalidErrors.startTime ||
      invalidErrors.endTime ||
      invalidErrors.mealType ||
      invalidErrors.distanceKm ||
      invalidErrors.elevationGainM
    ) {
      setShowAdvanced(true);
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
      className="space-y-5 lg:space-y-6"
    >
      {showValidationAlert && Object.keys(errors).length > 0 ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {t("errors.formInvalid")}
        </p>
      ) : null}
      <FormField
        label={t("fields.type.label")}
        htmlFor="moment-type"
        error={errors.type?.message}
      >
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <EventTypeQuickPicker
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div className="space-y-4">
          <FormField
            label={t("fields.title.label")}
            htmlFor="event-title"
            error={errors.title?.message}
          >
            <Input
              id="event-title"
              placeholder={t("fields.title.placeholderShort")}
              className="h-11 font-heading text-base"
              autoFocus
              {...register("title")}
              aria-invalid={!!errors.title}
            />
          </FormField>

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <MomentLocationPicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>{t("moreDetails")}</span>
              {showAdvanced ? (
                <ChevronUp className="size-4 shrink-0" aria-hidden />
              ) : (
                <ChevronDown className="size-4 shrink-0" aria-hidden />
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-4 border-t border-border px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label={
                      sleepLabels
                        ? t("fields.checkIn.label")
                        : t("fields.startTime.label")
                    }
                    htmlFor="event-start"
                    error={errors.startTime?.message}
                  >
                    <Input
                      id="event-start"
                      type="time"
                      {...register("startTime")}
                    />
                  </FormField>
                  <FormField
                    label={
                      sleepLabels
                        ? t("fields.checkOut.label")
                        : t("fields.endTime.label")
                    }
                    htmlFor="event-end"
                    error={errors.endTime?.message}
                  >
                    <Input id="event-end" type="time" {...register("endTime")} />
                  </FormField>
                </div>

                {showDistance && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label={t("fields.distance.label")}
                      htmlFor="event-distance"
                      hint={t("fields.distance.hint")}
                      error={errors.distanceKm?.message}
                    >
                      <Controller
                        name="distanceKm"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="event-distance"
                            type="number"
                            min={0}
                            step={0.1}
                            placeholder={t("fields.distance.placeholder")}
                            value={field.value ?? ""}
                            onChange={(event) => {
                              const next = event.target.value;
                              field.onChange(
                                next === "" ? undefined : Number(next),
                              );
                            }}
                          />
                        )}
                      />
                    </FormField>
                    <FormField
                      label={t("fields.elevation.label")}
                      htmlFor="event-elevation"
                      hint={t("fields.elevation.hint")}
                      error={errors.elevationGainM?.message}
                    >
                      <Controller
                        name="elevationGainM"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="event-elevation"
                            type="number"
                            min={0}
                            step={1}
                            placeholder={t("fields.elevation.placeholder")}
                            value={field.value ?? ""}
                            onChange={(event) => {
                              const next = event.target.value;
                              field.onChange(
                                next === "" ? undefined : Number(next),
                              );
                            }}
                          />
                        )}
                      />
                    </FormField>
                  </div>
                )}

                {showMeal && (
                  <FormField
                    label={t("fields.mealType.label")}
                    htmlFor="event-meal"
                    error={errors.mealType?.message}
                  >
                    <Controller
                      name="mealType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="event-meal" className="w-full">
                            <SelectValue
                              placeholder={t("fields.mealType.placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {MEAL_TYPE_OPTIONS.map((meal) => (
                              <SelectItem key={meal} value={meal}>
                                {tMeals(meal)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                )}

                {showCloudLinks && (
                  <CloudLinkList
                    links={cloudLinks}
                    editable
                    tripId={tripId}
                    eventId={editingEvent?.id}
                    onChange={setCloudLinks}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label={t("fields.description.label")}
            htmlFor="event-description"
            hint={t("fields.description.hint")}
            error={errors.description?.message}
          >
            <Textarea
              id="event-description"
              rows={5}
              className="min-h-[7.5rem] lg:min-h-[10rem]"
              placeholder={t("fields.description.placeholderShort")}
              {...register("description")}
            />
          </FormField>

          {draftEventId && (
            <MomentPhotoPicker
              photos={momentPhotos}
              onChange={setMomentPhotos}
              tripId={tripId}
              eventId={draftEventId}
            />
          )}
        </div>
      </div>
    </form>
  );
}
