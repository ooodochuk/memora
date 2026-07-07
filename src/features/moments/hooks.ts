import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMoment,
  deleteMoment,
  fetchMoment,
  fetchMomentsByAdventure,
  fetchMomentsByDay,
  updateMoment,
} from "./api";
import type { CreateMomentRequestDto, MomentDto, UpdateMomentRequestDto } from "./types";
import { adventureKeys } from "@/features/adventures/hooks";
import { removeById, upsertById } from "@/lib/query/list-cache";

export const momentKeys = {
  all: ["moments"] as const,
  byDay: (dayId: string) => [...momentKeys.all, "day", dayId] as const,
  byAdventure: (adventureId: string) =>
    [...momentKeys.all, "adventure", adventureId] as const,
  detail: (momentId: string) => [...momentKeys.all, "detail", momentId] as const,
};

function sortMoments(a: MomentDto, b: MomentDto) {
  return a.order - b.order;
}

export function useMomentsByDay(dayId: string) {
  return useQuery({
    queryKey: momentKeys.byDay(dayId),
    queryFn: () => fetchMomentsByDay(dayId),
    enabled: Boolean(dayId),
    staleTime: 0,
  });
}

export function useMomentsByAdventure(adventureId: string) {
  return useQuery({
    queryKey: momentKeys.byAdventure(adventureId),
    queryFn: () => fetchMomentsByAdventure(adventureId),
    enabled: Boolean(adventureId),
    staleTime: 0,
  });
}

export function useMoment(momentId: string) {
  return useQuery({
    queryKey: momentKeys.detail(momentId),
    queryFn: () => fetchMoment(momentId),
    enabled: Boolean(momentId),
    staleTime: 0,
  });
}

export function useCreateMoment(dayId: string, adventureId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMomentRequestDto) => createMoment(dayId, payload),
    onSuccess: (moment: MomentDto) => {
      queryClient.setQueryData(momentKeys.detail(moment.id), moment);
      queryClient.setQueryData(momentKeys.byDay(dayId), (current) =>
        upsertById(current as MomentDto[] | undefined, moment, sortMoments),
      );
      if (adventureId) {
        queryClient.setQueryData(momentKeys.byAdventure(adventureId), (current) =>
          upsertById(current as MomentDto[] | undefined, moment, sortMoments),
        );
        void queryClient.invalidateQueries({
          queryKey: adventureKeys.detail(adventureId),
        });
      }
    },
  });
}

export function useUpdateMoment(
  momentId: string,
  dayId?: string,
  adventureId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMomentRequestDto) =>
      updateMoment(momentId, payload),
    onSuccess: (moment: MomentDto) => {
      queryClient.setQueryData(momentKeys.detail(momentId), moment);
      if (dayId) {
        queryClient.setQueryData(momentKeys.byDay(dayId), (current) =>
          upsertById(current as MomentDto[] | undefined, moment, sortMoments),
        );
      }
      if (adventureId) {
        queryClient.setQueryData(momentKeys.byAdventure(adventureId), (current) =>
          upsertById(current as MomentDto[] | undefined, moment, sortMoments),
        );
        void queryClient.invalidateQueries({
          queryKey: adventureKeys.detail(adventureId),
        });
      }
    },
  });
}

export function useDeleteMoment(dayId: string, adventureId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (momentId: string) => deleteMoment(momentId),
    onSuccess: (_result, momentId) => {
      queryClient.removeQueries({ queryKey: momentKeys.detail(momentId) });
      queryClient.setQueryData(momentKeys.byDay(dayId), (current) =>
        removeById(current as MomentDto[] | undefined, momentId),
      );
      if (adventureId) {
        queryClient.setQueryData(momentKeys.byAdventure(adventureId), (current) =>
          removeById(current as MomentDto[] | undefined, momentId),
        );
        void queryClient.invalidateQueries({
          queryKey: adventureKeys.detail(adventureId),
        });
      }
    },
  });
}
