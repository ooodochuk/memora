"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { isMockMode } from "@/api/config";
import type { TripDay, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { dashboardRoutes } from "@/constants/routes";
import { useDeleteDay } from "@/features/days/hooks";
import { useDeleteMoment } from "@/features/moments/hooks";
import { TripDayAccordionItem } from "@/components/dashboard/trip/trip-day-accordion-item";
import { Accordion } from "@/components/ui/accordion";
import { TripDayDeleteDialog } from "@/components/dashboard/trip/trip-day-delete-dialog";
import { TripEventDeleteDialog } from "@/components/dashboard/trip/trip-event-delete-dialog";
import { TripDetailActions } from "@/components/dashboard/trip/trip-detail-actions";
import { useTripEditor } from "@/components/dashboard/trip/trip-editor-provider";
import { EmptyState } from "@/components/design-system/empty-state";
import { SectionHeader } from "@/components/design-system/section-header";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDetailContentProps {
  locale: AppLocale;
}

export function TripDetailContent({ locale }: TripDetailContentProps) {
  const t = useTranslations("dashboard.pages.tripDetail");
  const router = useRouter();
  const mockMode = isMockMode();
  const { tripId, timeline, deleteDay, deleteEvent } = useTripEditor();
  const deleteDayMutation = useDeleteDay(tripId);
  const deleteMomentMutation = useDeleteMoment("", tripId);

  const [deletingDay, setDeletingDay] = useState<TripDay | null>(null);
  const [deletingEvent, setDeletingEvent] =
    useState<TripEventWithRelations | null>(null);

  const openAddDay = useCallback(() => {
    router.push(dashboardRoutes.newDay(tripId));
  }, [router, tripId]);

  const openEditDay = useCallback(
    (day: TripDay) => {
      router.push(dashboardRoutes.editDay(tripId, day.id));
    },
    [router, tripId],
  );

  const handleDeleteDay = useCallback(async () => {
    if (!deletingDay) return;
    if (mockMode) {
      deleteDay(deletingDay.id);
    } else {
      await deleteDayMutation.mutateAsync(deletingDay.id);
    }
    setDeletingDay(null);
  }, [deletingDay, deleteDay, deleteDayMutation, mockMode]);

  const openAddEvent = useCallback(
    (dayId: string) => {
      router.push(dashboardRoutes.newMoment(tripId, dayId));
    },
    [router, tripId],
  );

  const openEditEvent = useCallback(
    (event: TripEventWithRelations) => {
      router.push(dashboardRoutes.editMoment(tripId, event.id));
    },
    [router, tripId],
  );

  const handleDeleteEvent = useCallback(async () => {
    if (!deletingEvent) return;
    if (mockMode) {
      deleteEvent(deletingEvent.id, deletingEvent.dayId);
    } else {
      await deleteMomentMutation.mutateAsync(deletingEvent.id);
    }
    setDeletingEvent(null);
  }, [deletingEvent, deleteEvent, deleteMomentMutation, mockMode]);

  return (
    <>
      <TripDetailActions tripId={tripId} />

      <section className="space-y-6">
        <SectionHeader title={t("timelineTitle")} titleAs="h2" />

        {timeline.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={t("noDays")}
            description={t("noDaysDescription")}
            action={
              <Button variant="warm" onClick={openAddDay}>
                <Plus className="size-4" />
                {t("actions.addDay")}
              </Button>
            }
          />
        ) : (
          <Accordion
            multiple
            defaultValue={timeline.map((entry) => entry.day.id)}
            className="space-y-3"
          >
            {timeline.map((entry) => (
              <TripDayAccordionItem
                key={entry.day.id}
                locale={locale}
                day={entry.day}
                events={entry.events}
                onEdit={() => openEditDay(entry.day)}
                onDelete={() => setDeletingDay(entry.day)}
                onAddEvent={() => openAddEvent(entry.day.id)}
                onEditEvent={openEditEvent}
                onDeleteEvent={setDeletingEvent}
              />
            ))}
          </Accordion>
        )}

        {timeline.length > 0 && (
          <div className={cn("flex justify-center pt-2")}>
            <Button variant="outline" onClick={openAddDay}>
              <Plus className="size-4" />
              {t("addAnotherDay")}
            </Button>
          </div>
        )}
      </section>

      <TripDayDeleteDialog
        day={deletingDay}
        open={deletingDay !== null}
        onOpenChange={(open) => !open && setDeletingDay(null)}
        onConfirm={handleDeleteDay}
      />

      <TripEventDeleteDialog
        event={deletingEvent}
        open={deletingEvent !== null}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        onConfirm={handleDeleteEvent}
      />
    </>
  );
}
