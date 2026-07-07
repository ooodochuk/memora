import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDay,
  deleteDay,
  fetchDay,
  fetchDaysByAdventure,
  updateDay,
} from "./api";
import type { CreateDayRequestDto, DayDto, UpdateDayRequestDto } from "./types";
import { adventureKeys } from "@/features/adventures/hooks";
import { removeById, upsertById } from "@/lib/query/list-cache";

export const dayKeys = {
  all: ["days"] as const,
  byAdventure: (adventureId: string) =>
    [...dayKeys.all, "adventure", adventureId] as const,
  detail: (dayId: string) => [...dayKeys.all, "detail", dayId] as const,
};

function sortDays(a: DayDto, b: DayDto) {
  return a.dayNumber - b.dayNumber;
}

export function useDaysByAdventure(adventureId: string) {
  return useQuery({
    queryKey: dayKeys.byAdventure(adventureId),
    queryFn: () => fetchDaysByAdventure(adventureId),
    enabled: Boolean(adventureId),
    staleTime: 0,
  });
}

export function useDay(dayId: string) {
  return useQuery({
    queryKey: dayKeys.detail(dayId),
    queryFn: () => fetchDay(dayId),
    enabled: Boolean(dayId),
    staleTime: 0,
  });
}

export function useCreateDay(adventureId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDayRequestDto) => createDay(adventureId, payload),
    onSuccess: (day: DayDto) => {
      queryClient.setQueryData(dayKeys.detail(day.id), day);
      queryClient.setQueryData(dayKeys.byAdventure(adventureId), (current) =>
        upsertById(current as DayDto[] | undefined, day, sortDays),
      );
      void queryClient.invalidateQueries({
        queryKey: adventureKeys.detail(adventureId),
      });
    },
  });
}

export function useUpdateDay(dayId: string, adventureId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDayRequestDto) => updateDay(dayId, payload),
    onSuccess: (day: DayDto) => {
      queryClient.setQueryData(dayKeys.detail(dayId), day);
      if (adventureId) {
        queryClient.setQueryData(dayKeys.byAdventure(adventureId), (current) =>
          upsertById(current as DayDto[] | undefined, day, sortDays),
        );
        void queryClient.invalidateQueries({
          queryKey: adventureKeys.detail(adventureId),
        });
      }
    },
  });
}

export function useDeleteDay(adventureId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayId: string) => deleteDay(dayId),
    onSuccess: (_result, dayId) => {
      queryClient.removeQueries({ queryKey: dayKeys.detail(dayId) });
      queryClient.setQueryData(dayKeys.byAdventure(adventureId), (current) =>
        removeById(current as DayDto[] | undefined, dayId),
      );
      void queryClient.invalidateQueries({
        queryKey: adventureKeys.detail(adventureId),
      });
    },
  });
}
