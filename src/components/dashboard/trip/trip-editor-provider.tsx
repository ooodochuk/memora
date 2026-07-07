"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CloudLink, Photo, Place, TripDay, TripEvent } from "@/types";
import type { TripEventWithRelations } from "@/types";
import {
  normalizeTimelineDays,
  nextEventOrder,
  resolveEventRelations,
  type TripTimelineDay,
} from "@/lib/trip-timeline/utils";

interface RawTimelineDay {
  day: TripDay;
  events: TripEvent[];
}

interface TripEditorContextValue {
  tripId: string;
  tripStartDate: string;
  timeline: TripTimelineDay[];
  places: Place[];
  saveDay: (day: TripDay) => void;
  deleteDay: (dayId: string) => void;
  saveEvent: (payload: {
    event: TripEvent;
    cloudLinks: CloudLink[];
    photos: Photo[];
  }) => void;
  deleteEvent: (eventId: string, dayId: string) => void;
  getDay: (dayId: string) => TripDay | undefined;
  getEvent: (eventId: string) => TripEventWithRelations | undefined;
  getNextEventOrder: (dayId: string) => number;
  getEventCloudLinks: (eventId: string) => CloudLink[];
  getEventPhotos: (eventId: string) => Photo[];
}

const TripEditorContext = createContext<TripEditorContextValue | null>(null);

function toRawTimeline(days: TripTimelineDay[]): RawTimelineDay[] {
  return days.map(({ day, events }) => ({
    day,
    events: events.map((event) => {
      // Strip relation fields before storing raw timeline events.
      const { place, photos, cloudLinks, participants, ...rest } = event;
      void place;
      void photos;
      void cloudLinks;
      void participants;
      return rest;
    }),
  }));
}

function extractCloudLinks(days: TripTimelineDay[]): CloudLink[] {
  const map = new Map<string, CloudLink>();
  for (const { events } of days) {
    for (const event of events) {
      for (const link of event.cloudLinks) {
        map.set(link.id, link);
      }
    }
  }
  return [...map.values()];
}

function extractPhotos(days: TripTimelineDay[]): Photo[] {
  const map = new Map<string, Photo>();
  for (const { events } of days) {
    for (const event of events) {
      for (const photo of event.photos) {
        map.set(photo.id, photo);
      }
    }
  }
  return [...map.values()];
}

interface TripEditorProviderProps {
  tripId: string;
  tripStartDate: string;
  initialDays: TripTimelineDay[];
  initialPlaces: Place[];
  children: ReactNode;
}

export function TripEditorProvider({
  tripId,
  tripStartDate,
  initialDays,
  initialPlaces,
  children,
}: TripEditorProviderProps) {
  const [rawDays, setRawDays] = useState<RawTimelineDay[]>(() =>
    toRawTimeline(initialDays),
  );
  const [places] = useState<Place[]>(initialPlaces);
  const [cloudLinks, setCloudLinks] = useState<CloudLink[]>(() =>
    extractCloudLinks(initialDays),
  );
  const [photos, setPhotos] = useState<Photo[]>(() => extractPhotos(initialDays));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset editor when API timeline refreshes
    setRawDays(toRawTimeline(initialDays));
    setCloudLinks(extractCloudLinks(initialDays));
    setPhotos(extractPhotos(initialDays));
  }, [initialDays]);

  const timeline = useMemo(
    () =>
      normalizeTimelineDays(
        rawDays.map((entry) => ({
          day: entry.day,
          events: entry.events.map((event) =>
            resolveEventRelations(event, places, cloudLinks, photos),
          ),
        })),
      ),
    [rawDays, places, cloudLinks, photos],
  );

  const saveDay = useCallback((day: TripDay) => {
    setRawDays((prev) => {
      const exists = prev.some((entry) => entry.day.id === day.id);
      if (exists) {
        return prev.map((entry) =>
          entry.day.id === day.id ? { ...entry, day } : entry,
        );
      }
      return [...prev, { day, events: [] }];
    });
  }, []);

  const deleteDay = useCallback((dayId: string) => {
    setRawDays((prev) => prev.filter((entry) => entry.day.id !== dayId));
  }, []);

  const saveEvent = useCallback(
    (payload: {
      event: TripEvent;
      cloudLinks: CloudLink[];
      photos: Photo[];
    }) => {
      const { event, cloudLinks: eventLinks, photos: eventPhotos } = payload;

      setCloudLinks((prev) => {
        const withoutEvent = prev.filter((link) => link.eventId !== event.id);
        return [...withoutEvent, ...eventLinks];
      });

      setPhotos((prev) => {
        const withoutEvent = prev.filter((photo) => photo.eventId !== event.id);
        return [...withoutEvent, ...eventPhotos];
      });

      setRawDays((prev) =>
        prev.map((entry) => {
          if (entry.day.id !== event.dayId) return entry;
          const exists = entry.events.some((item) => item.id === event.id);
          if (exists) {
            return {
              ...entry,
              events: entry.events.map((item) =>
                item.id === event.id ? event : item,
              ),
            };
          }
          return { ...entry, events: [...entry.events, event] };
        }),
      );
    },
    [],
  );

  const deleteEvent = useCallback((eventId: string, dayId: string) => {
    setRawDays((prev) =>
      prev.map((entry) =>
        entry.day.id === dayId
          ? {
              ...entry,
              events: entry.events.filter((event) => event.id !== eventId),
            }
          : entry,
      ),
    );
    setCloudLinks((prev) => prev.filter((link) => link.eventId !== eventId));
    setPhotos((prev) => prev.filter((photo) => photo.eventId !== eventId));
  }, []);

  const getDay = useCallback(
    (dayId: string) => timeline.find((entry) => entry.day.id === dayId)?.day,
    [timeline],
  );

  const getEvent = useCallback(
    (eventId: string) => {
      for (const entry of timeline) {
        const event = entry.events.find((item) => item.id === eventId);
        if (event) return event;
      }
      return undefined;
    },
    [timeline],
  );

  const getNextEventOrder = useCallback(
    (dayId: string) => {
      const day = timeline.find((entry) => entry.day.id === dayId);
      return day ? nextEventOrder(day.events) : 1;
    },
    [timeline],
  );

  const getEventCloudLinks = useCallback(
    (eventId: string) => cloudLinks.filter((link) => link.eventId === eventId),
    [cloudLinks],
  );

  const getEventPhotos = useCallback(
    (eventId: string) => photos.filter((photo) => photo.eventId === eventId),
    [photos],
  );

  const value = useMemo<TripEditorContextValue>(
    () => ({
      tripId,
      tripStartDate,
      timeline,
      places,
      saveDay,
      deleteDay,
      saveEvent,
      deleteEvent,
      getDay,
      getEvent,
      getNextEventOrder,
      getEventCloudLinks,
      getEventPhotos,
    }),
    [
      tripId,
      tripStartDate,
      timeline,
      places,
      saveDay,
      deleteDay,
      saveEvent,
      deleteEvent,
      getDay,
      getEvent,
      getNextEventOrder,
      getEventCloudLinks,
      getEventPhotos,
    ],
  );

  return (
    <TripEditorContext.Provider value={value}>
      {children}
    </TripEditorContext.Provider>
  );
}

export function useTripEditor(): TripEditorContextValue {
  const context = useContext(TripEditorContext);
  if (!context) {
    throw new Error("useTripEditor must be used within TripEditorProvider");
  }
  return context;
}
