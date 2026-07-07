import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEquipment,
  deleteEquipment,
  fetchActiveEquipment,
  fetchEquipmentByAdventure,
  fetchEquipmentCategories,
  fetchEquipmentInventory,
  fetchEquipmentItem,
  fetchEquipmentList,
  setEquipmentActive,
  syncAdventureEquipment,
  updateEquipment,
} from "./api";
import type { CreateEquipmentRequestDto, UpdateEquipmentRequestDto } from "./types";

export const equipmentKeys = {
  all: ["equipment"] as const,
  inventory: () => [...equipmentKeys.all, "inventory"] as const,
  list: () => [...equipmentKeys.all, "list"] as const,
  active: () => [...equipmentKeys.all, "active"] as const,
  categories: () => [...equipmentKeys.all, "categories"] as const,
  byAdventure: (adventureId: string) =>
    [...equipmentKeys.all, "adventure", adventureId] as const,
  detail: (id: string) => [...equipmentKeys.all, "detail", id] as const,
};

export function useEquipmentInventory() {
  return useQuery({
    queryKey: equipmentKeys.inventory(),
    queryFn: fetchEquipmentInventory,
  });
}

export function useEquipmentList() {
  return useQuery({
    queryKey: equipmentKeys.list(),
    queryFn: fetchEquipmentList,
  });
}

export function useEquipmentCategories() {
  return useQuery({
    queryKey: equipmentKeys.categories(),
    queryFn: fetchEquipmentCategories,
  });
}

export function useActiveEquipment() {
  return useQuery({
    queryKey: equipmentKeys.active(),
    queryFn: fetchActiveEquipment,
  });
}

export function useEquipmentItem(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => fetchEquipmentItem(id),
    enabled: Boolean(id),
  });
}

export function useEquipmentByAdventure(adventureId: string) {
  return useQuery({
    queryKey: equipmentKeys.byAdventure(adventureId),
    queryFn: () => fetchEquipmentByAdventure(adventureId),
    enabled: Boolean(adventureId),
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEquipmentRequestDto) => createEquipment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}

export function useUpdateEquipment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEquipmentRequestDto) =>
      updateEquipment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.list() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.inventory() });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}

export function useSetEquipmentActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      setEquipmentActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}

export function useSyncAdventureEquipment(adventureId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      selectedIds,
      currentIds,
    }: {
      selectedIds: string[];
      currentIds: string[];
    }) => syncAdventureEquipment(adventureId, selectedIds, currentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.byAdventure(adventureId),
      });
    },
  });
}
