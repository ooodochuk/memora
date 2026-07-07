import type { TripFormInputValues } from "@/lib/validations/trip-form";

export interface CreateAdventureDraft {
  form: TripFormInputValues;
  selectedEquipmentIds: string[];
  savedAt: string;
}
