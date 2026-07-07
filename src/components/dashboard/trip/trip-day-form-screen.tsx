"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { isMockMode } from "@/api/config";
import { dashboardRoutes } from "@/constants/routes";
import { createNextDayDefaults } from "@/lib/validations/trip-day-form";
import { tripDayFormToCreateDay, dayDtoToTripDay } from "@/lib/api-mappers";
import { useCreateDay, useDay, useUpdateDay } from "@/features/days/hooks";
import { QueryLoading } from "@/components/data-state/query-state";
import { ResponsiveFormScreen } from "@/components/design-system/responsive-form-screen";
import { TripDayForm } from "@/components/dashboard/trip/trip-day-form";
import { useTripEditor } from "@/components/dashboard/trip/trip-editor-provider";
import { Button } from "@/components/ui/button";
import type { TripDay } from "@/types";

const FORM_ID = "trip-day-form";

interface TripDayFormScreenProps {
  mode: "create" | "edit";
  dayId?: string;
}

export function TripDayFormScreen({ mode, dayId }: TripDayFormScreenProps) {
  const t = useTranslations("dashboard.tripDayForm");
  const tDetail = useTranslations("dashboard.pages.tripDetail");
  const router = useRouter();
  const mockMode = isMockMode();
  const { tripId, tripStartDate, timeline, saveDay, getDay } = useTripEditor();
  const createDayMutation = useCreateDay(tripId);
  const updateDayMutation = useUpdateDay(dayId ?? "", tripId);
  const dayQuery = useDay(dayId ?? "");

  const editingDayFromApi =
    mode === "edit" && dayQuery.data ? dayDtoToTripDay(dayQuery.data) : null;
  const editingDay =
    mode === "edit" && dayId
      ? (getDay(dayId) ?? editingDayFromApi)
      : null;
  const dayEntities = useMemo(
    () => timeline.map((entry) => entry.day),
    [timeline],
  );
  const dayNumber = editingDay?.dayNumber ?? dayEntities.length + 1;
  const defaultValues =
    mode === "create"
      ? createNextDayDefaults(dayEntities, tripStartDate)
      : undefined;

  const backHref = dashboardRoutes.trip(tripId);
  const title = mode === "edit" ? t("editTitle") : t("addTitle");

  useEffect(() => {
    if (mode !== "edit" || !dayId || mockMode) return;
    if (dayQuery.isLoading || editingDay) return;
    if (dayQuery.isError || !dayQuery.data) {
      router.replace(backHref);
    }
  }, [
    mode,
    dayId,
    editingDay,
    dayQuery.isLoading,
    dayQuery.isError,
    dayQuery.data,
    mockMode,
    router,
    backHref,
  ]);

  useEffect(() => {
    if (mockMode && mode === "edit" && dayId && !editingDay) {
      router.replace(backHref);
    }
  }, [mockMode, mode, dayId, editingDay, router, backHref]);

  async function handleSubmit(day: TripDay) {
    if (mockMode) {
      saveDay(day);
    } else if (mode === "create") {
      await createDayMutation.mutateAsync(tripDayFormToCreateDay({
        date: day.date,
        title: day.title ?? "",
        description: day.summary ?? "",
        activities: day.activities ?? [],
      }));
    } else if (dayId) {
      await updateDayMutation.mutateAsync(tripDayFormToCreateDay({
        date: day.date,
        title: day.title ?? "",
        description: day.summary ?? "",
        activities: day.activities ?? [],
      }));
    }
    router.push(backHref);
  }

  if (mode === "edit" && dayId && !editingDay) {
    if (!mockMode && dayQuery.isLoading) {
      return <QueryLoading className="min-h-[40vh]" />;
    }
    return null;
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
            type="submit"
            form={FORM_ID}
            variant="warm"
            size="lg"
            className="h-12 min-w-[120px] sm:h-10"
          >
            {mode === "edit" ? t("actions.save") : t("actions.add")}
          </Button>
        </>
      }
    >
      <TripDayForm
        formId={FORM_ID}
        tripId={tripId}
        editingDay={editingDay}
        defaultValues={defaultValues}
        dayNumber={dayNumber}
        onSubmit={handleSubmit}
      />
    </ResponsiveFormScreen>
  );
}
