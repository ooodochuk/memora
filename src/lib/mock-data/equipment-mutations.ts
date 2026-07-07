import type { Equipment } from "@/types";
import { equipment } from "./equipment";

export function removeEquipmentById(id: string): void {
  const index = equipment.findIndex((item) => item.id === id);
  if (index >= 0) {
    equipment.splice(index, 1);
  }
}

export function setEquipmentActiveState(
  id: string,
  isActive: boolean,
): Equipment | undefined {
  const item = equipment.find((entry) => entry.id === id);
  if (!item) return undefined;
  item.isActive = isActive;
  return item;
}
