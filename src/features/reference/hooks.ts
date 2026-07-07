import { useQuery } from "@tanstack/react-query";
import { fetchAdventureStatuses } from "./api";

export const referenceKeys = {
  all: ["reference"] as const,
  adventureStatuses: () => [...referenceKeys.all, "adventure-statuses"] as const,
};

export function useAdventureStatuses() {
  return useQuery({
    queryKey: referenceKeys.adventureStatuses(),
    queryFn: fetchAdventureStatuses,
    staleTime: 60 * 60 * 1000,
  });
}
