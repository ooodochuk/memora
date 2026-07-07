import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createAdventure,
  deleteAdventure,
  archiveAdventure,
  fetchAdventure,
  fetchAdventures,
  fetchAdventureSummaries,
  fetchDashboardHome,
  updateAdventure,
  updateAdventureStatus,
} from "./api";
import type {
  AdventureDto,
  AdventureSummaryDto,
  CreateAdventureRequestDto,
  UpdateAdventureRequestDto,
} from "./types";
import { upsertById, removeById } from "@/lib/query/list-cache";

export const adventureKeys = {
  all: ["adventures"] as const,
  lists: () => [...adventureKeys.all, "list"] as const,
  list: () => [...adventureKeys.lists()] as const,
  summaries: () => [...adventureKeys.all, "summaries"] as const,
  dashboard: () => [...adventureKeys.all, "dashboard"] as const,
  details: () => [...adventureKeys.all, "detail"] as const,
  detail: (id: string) => [...adventureKeys.details(), id] as const,
};

export function useAdventures() {
  return useQuery({
    queryKey: adventureKeys.list(),
    queryFn: fetchAdventures,
  });
}

export function useAdventureSummaries() {
  return useQuery({
    queryKey: adventureKeys.summaries(),
    queryFn: fetchAdventureSummaries,
  });
}

export function useDashboardHome() {
  return useQuery({
    queryKey: adventureKeys.dashboard(),
    queryFn: fetchDashboardHome,
  });
}

export function useAdventure(id: string) {
  return useQuery({
    queryKey: adventureKeys.detail(id),
    queryFn: () => fetchAdventure(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

function patchAdventureCaches(queryClient: QueryClient, adventure: AdventureDto) {
  queryClient.setQueryData(adventureKeys.detail(adventure.id), adventure);
  queryClient.setQueryData(adventureKeys.list(), (current) =>
    upsertById(current as AdventureDto[] | undefined, adventure),
  );
  queryClient.setQueryData(adventureKeys.summaries(), (current) => {
    const summaries = current as AdventureSummaryDto[] | undefined;
    if (!summaries) return summaries;
    return summaries.map((summary) =>
      summary.adventure.id === adventure.id
        ? { ...summary, adventure }
        : summary,
    );
  });
}

export function useCreateAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdventureRequestDto) => createAdventure(payload),
    onSuccess: async (data: AdventureDto) => {
      patchAdventureCaches(queryClient, data);
      await queryClient.refetchQueries({ queryKey: adventureKeys.detail(data.id) });
      void queryClient.invalidateQueries({ queryKey: adventureKeys.dashboard() });
    },
  });
}

export function useUpdateAdventure(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdventureRequestDto) =>
      updateAdventure(id, payload),
    onSuccess: async (data: AdventureDto) => {
      patchAdventureCaches(queryClient, data);
      await queryClient.refetchQueries({ queryKey: adventureKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: adventureKeys.dashboard() });
    },
  });
}

export function useDeleteAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdventure(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: adventureKeys.detail(id) });
      queryClient.setQueryData(adventureKeys.list(), (current) =>
        removeById(current as AdventureDto[] | undefined, id),
      );
      queryClient.setQueryData(adventureKeys.summaries(), (current) => {
        const summaries = current as AdventureSummaryDto[] | undefined;
        return summaries?.filter((summary) => summary.adventure.id !== id);
      });
      void queryClient.invalidateQueries({ queryKey: adventureKeys.dashboard() });
    },
  });
}

export function useArchiveAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveAdventure(id),
    onSuccess: (data) => {
      patchAdventureCaches(queryClient, data);
      void queryClient.invalidateQueries({ queryKey: adventureKeys.dashboard() });
    },
  });
}

export function useUpdateAdventureStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusCode: string) => updateAdventureStatus(id, statusCode),
    onSuccess: (data) => {
      patchAdventureCaches(queryClient, data);
      void queryClient.invalidateQueries({ queryKey: adventureKeys.dashboard() });
    },
  });
}
