"use client";

import { useMemo } from "react";
import { isMockMode } from "@/api/config";
import { useAdventure } from "@/features/adventures/hooks";
import { useDaysByAdventure } from "@/features/days/hooks";
import { useMomentsByAdventure } from "@/features/moments/hooks";
import { QueryError, QueryLoading } from "@/components/data-state/query-state";
import { TripEditorProvider } from "@/components/dashboard/trip/trip-editor-provider";
import {
  dayDtoToTripDay,
  momentDtoToTripEvent,
} from "@/lib/api-mappers";
import { resolveEventRelations } from "@/lib/trip-timeline/utils";
import {
  getDaysByTripId,
  getEventsWithRelationsByDayId,
  getPlacesByTripId,
  getTripById,
} from "@/lib/mock-data";

interface TripWorkspaceLayoutProps {
  adventureId: string;
  children: React.ReactNode;
}

export function TripWorkspaceLayout({
  adventureId,
  children,
}: TripWorkspaceLayoutProps) {
  if (isMockMode()) {
    return <TripWorkspaceMock adventureId={adventureId}>{children}</TripWorkspaceMock>;
  }

  return (
    <TripWorkspaceApi adventureId={adventureId}>{children}</TripWorkspaceApi>
  );
}

function TripWorkspaceMock({
  adventureId,
  children,
}: TripWorkspaceLayoutProps) {
  const trip = getTripById(adventureId);
  if (!trip) return null;

  const days = getDaysByTripId(trip.id);
  const timelineDays = days.map((day) => ({
    day,
    events: getEventsWithRelationsByDayId(day.id),
  }));
  const tripPlaces = getPlacesByTripId(trip.id);

  return (
    <TripEditorProvider
      tripId={trip.id}
      tripStartDate={trip.startDate}
      initialDays={timelineDays}
      initialPlaces={tripPlaces}
    >
      {children}
    </TripEditorProvider>
  );
}

function TripWorkspaceApi({
  adventureId,
  children,
}: TripWorkspaceLayoutProps) {
  const adventureQuery = useAdventure(adventureId);
  const daysQuery = useDaysByAdventure(adventureId);
  const momentsQuery = useMomentsByAdventure(adventureId);

  const timelineDays = useMemo(() => {
    const days = daysQuery.data ?? [];
    const moments = momentsQuery.data ?? [];
    const momentsByDay = new Map<string, ReturnType<typeof momentDtoToTripEvent>[]>();

    for (const moment of moments) {
      const event = momentDtoToTripEvent(moment);
      const list = momentsByDay.get(moment.dayId) ?? [];
      list.push(event);
      momentsByDay.set(moment.dayId, list);
    }

    return days.map((dayDto) => {
      const day = dayDtoToTripDay(dayDto);
      const events = (momentsByDay.get(day.id) ?? []).map((event) =>
        resolveEventRelations(event, [], [], []),
      );
      return { day, events };
    });
  }, [daysQuery.data, momentsQuery.data]);

  const isLoading =
    adventureQuery.isLoading || daysQuery.isLoading || momentsQuery.isLoading;
  const queryError =
    adventureQuery.error ?? daysQuery.error ?? momentsQuery.error;

  if (isLoading) {
    return <QueryLoading />;
  }

  if (queryError) {
    return (
      <QueryError
        error={queryError}
        onRetry={() => {
          void adventureQuery.refetch();
          void daysQuery.refetch();
          void momentsQuery.refetch();
        }}
      />
    );
  }

  if (!adventureQuery.data) {
    return null;
  }

  return (
    <TripEditorProvider
      tripId={adventureId}
      tripStartDate={adventureQuery.data.startDate}
      initialDays={timelineDays}
      initialPlaces={[]}
    >
      {children}
    </TripEditorProvider>
  );
}
