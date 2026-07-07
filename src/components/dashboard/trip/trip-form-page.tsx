"use client";

import type { Equipment, EquipmentCategory } from "@/types";
import type { TripFormInputValues } from "@/lib/validations/trip-form";
import {
  TripFormScreen,
  useTripFormScreenLabels,
} from "@/components/dashboard/trip/trip-form-screen";
import { TripForm } from "@/components/dashboard/trip/trip-form";

const FORM_ID = "trip-form";

interface TripFormPageProps {
  mode: "create" | "edit";
  title: string;
  backHref: string;
  backLabel: string;
  tripId?: string;
  defaultValues?: TripFormInputValues;
  inventory?: Equipment[];
  equipmentCategories?: EquipmentCategory[];
  defaultEquipmentIds?: string[];
  size?: "default" | "wide";
}

export function TripFormPage({
  mode,
  title,
  backHref,
  backLabel,
  tripId,
  defaultValues,
  inventory = [],
  equipmentCategories = [],
  defaultEquipmentIds = [],
  size = "wide",
}: TripFormPageProps) {
  const { cancelLabel, submitLabel } = useTripFormScreenLabels(mode);

  return (
    <TripFormScreen
      title={title}
      backHref={backHref}
      backLabel={backLabel}
      formId={FORM_ID}
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      size={size}
    >
      <TripForm
        mode={mode}
        formId={FORM_ID}
        hideActions
        tripId={tripId}
        defaultValues={defaultValues}
        inventory={inventory}
        equipmentCategories={equipmentCategories}
        defaultEquipmentIds={defaultEquipmentIds}
      />
    </TripFormScreen>
  );
}
