"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { isMockMode } from "@/api/config";
import { dayDtoToTripDay, momentDtoToTripEvent } from "@/lib/api-mappers";
import { useDay } from "@/features/days/hooks";
import { useCreateMoment, useMoment, useUpdateMoment } from "@/features/moments/hooks";
import { QueryLoading } from "@/components/data-state/query-state";
import type { CreateMomentRequestDto } from "@/features/moments/types";
import { dashboardRoutes } from "@/constants/routes";
import { ResponsiveFormScreen } from "@/components/design-system/responsive-form-screen";
import { TripMomentForm } from "@/components/dashboard/trip/trip-moment-form";
import { useTripEditor } from "@/components/dashboard/trip/trip-editor-provider";
import { Button } from "@/components/ui/button";

const FORM_ID = "trip-moment-form";

interface TripMomentFormScreenProps {
  mode: "create" | "edit";
  dayId?: string;
  eventId?: string;
}

export function TripMomentFormScreen({
  mode,
  dayId: dayIdProp,
  eventId,
}: TripMomentFormScreenProps) {
  const t = useTranslations("dashboard.tripEventModal");
  const tDetail = useTranslations("dashboard.pages.tripDetail");
  const router = useRouter();
  const mockMode = isMockMode();
  const {
    tripId,
    saveEvent,
    getDay,
    getEvent,
    getNextEventOrder,
    getEventCloudLinks,
    getEventPhotos,
  } = useTripEditor();

  const relatedEventFromEditor =
    mode === "edit" && eventId ? getEvent(eventId) : undefined;
  const momentQuery = useMoment(eventId ?? "");
  const relatedEventFromApi =
    mode === "edit" && momentQuery.data
      ? momentDtoToTripEvent(momentQuery.data)
      : undefined;
  const relatedEvent = relatedEventFromEditor ?? relatedEventFromApi;

  const dayId = dayIdProp ?? relatedEvent?.dayId ?? "";
  const createMoment = useCreateMoment(dayId, tripId);
  const updateMoment = useUpdateMoment(eventId ?? "", dayId, tripId);
  const [saveError, setSaveError] = useState<string | null>(null);
  const dayQuery = useDay(dayId);
  const dayFromApi = dayQuery.data ? dayDtoToTripDay(dayQuery.data) : undefined;
  const day = dayId ? (getDay(dayId) ?? dayFromApi) : undefined;

  const backHref = dashboardRoutes.trip(tripId);
  const title = mode === "edit" ? t("editTitle") : t("addTitle");

  useEffect(() => {
    if (mockMode) {
      if (!day || (mode === "edit" && eventId && !relatedEvent)) {
        router.replace(backHref);
      }
      return;
    }

    if (dayQuery.isLoading || (mode === "edit" && eventId && momentQuery.isLoading)) {
      return;
    }

    if (!day || (mode === "edit" && eventId && !relatedEvent)) {
      router.replace(backHref);
    }
  }, [
    mockMode,
    day,
    mode,
    eventId,
    relatedEvent,
    dayQuery.isLoading,
    momentQuery.isLoading,
    router,
    backHref,
  ]);

  if (!day || (mode === "edit" && eventId && !relatedEvent)) {
    if (
      !mockMode &&
      (dayQuery.isLoading || (mode === "edit" && eventId && momentQuery.isLoading))
    ) {
      return <QueryLoading className="min-h-[40vh]" />;
    }
    return null;
  }

  const nextOrder = getNextEventOrder(dayId);
  const initialCloudLinks =
    mode === "edit" && eventId ? getEventCloudLinks(eventId) : [];
  const initialPhotos =
    mode === "edit" && eventId ? getEventPhotos(eventId) : [];

  async function handleSubmit(payload: Parameters<typeof saveEvent>[0]) {
    setSaveError(null);
    try {
      if (mockMode) {
        saveEvent(payload);
      } else {
        const { event } = payload;
        const body: CreateMomentRequestDto = {
          type: event.type,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          order: event.order,
          amount: event.amount,
          currency: event.currency,
          mealType: event.mealType,
          ...(event.distanceKm != null ? { distanceKm: event.distanceKm } : {}),
          ...(event.elevationGainM != null
            ? { elevationGainM: event.elevationGainM }
            : {}),
        };

        if (mode === "create") {
          await createMoment.mutateAsync(body);
        } else if (eventId) {
          await updateMoment.mutateAsync(body);
        }
      }
      router.push(backHref);
    } catch {
      setSaveError(t("errors.saveError"));
    }
  }

  function submitForm() {
    const form = document.getElementById(FORM_ID);
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  }

  return (
    <ResponsiveFormScreen
      title={title}
      backHref={backHref}
      backLabel={tDetail("backToTrips")}
      size="wide"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="h-12 sm:h-10"
            onClick={() => router.push(backHref)}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="button"
            variant="warm"
            size="lg"
            className="h-12 min-w-[120px] sm:h-10"
            disabled={createMoment.isPending || updateMoment.isPending}
            onClick={submitForm}
          >
            {mode === "edit" ? t("actions.save") : t("actions.add")}
          </Button>
        </>
      }
    >
      {saveError ? (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {saveError}
        </p>
      ) : null}
      <TripMomentForm
        formId={FORM_ID}
        tripId={tripId}
        dayId={dayId}
        editingEvent={relatedEvent ?? null}
        initialCloudLinks={initialCloudLinks}
        initialPhotos={initialPhotos}
        nextOrder={nextOrder}
        onSubmit={handleSubmit}
      />
    </ResponsiveFormScreen>
  );
}
