"use client";

import { useTranslations } from "next-intl";
import { useAdventure } from "@/features/adventures/hooks";
import {
  useEquipmentByAdventure,
  useEquipmentInventory,
} from "@/features/equipment/hooks";
import { QueryError, QueryLoading } from "@/components/data-state/query-state";
import { TripFormPage } from "@/components/dashboard/trip/trip-form-page";
import { dashboardRoutes } from "@/constants/routes";
import {
  adventureDtoToTrip,
  categoryDtoToCategory,
  equipmentDtoToEquipment,
} from "@/lib/api-mappers";
import { tripToFormValues } from "@/lib/validations/trip-form";

interface EditTripPageClientProps {
  adventureId: string;
}

export function EditTripPageClient({ adventureId }: EditTripPageClientProps) {
  const t = useTranslations("dashboard.pages.editTrip");
  const tForm = useTranslations("dashboard.tripForm");
  const adventureQuery = useAdventure(adventureId);
  const inventoryQuery = useEquipmentInventory();
  const tripEquipmentQuery = useEquipmentByAdventure(adventureId);

  const isLoading =
    adventureQuery.isLoading ||
    inventoryQuery.isLoading ||
    tripEquipmentQuery.isLoading;

  if (isLoading) {
    return <QueryLoading className="min-h-[40vh]" />;
  }

  const failedQuery = adventureQuery.isError
    ? adventureQuery
    : inventoryQuery.isError
      ? inventoryQuery
      : tripEquipmentQuery.isError
        ? tripEquipmentQuery
        : null;

  if (failedQuery) {
    return (
      <QueryError
        error={failedQuery.error}
        onRetry={() => failedQuery.refetch()}
        className="min-h-[40vh]"
      />
    );
  }

  if (!adventureQuery.data) {
    return null;
  }

  const trip = adventureDtoToTrip(adventureQuery.data);
  const inventory = (inventoryQuery.data?.items ?? [])
    .map(equipmentDtoToEquipment)
    .filter((item) => item.isActive);
  const categories = (inventoryQuery.data?.categories ?? []).map(
    categoryDtoToCategory,
  );
  const defaultEquipmentIds = (tripEquipmentQuery.data ?? []).map((item) => item.id);

  return (
    <TripFormPage
      mode="edit"
      title={t("title")}
      backHref={dashboardRoutes.trip(adventureId)}
      backLabel={tForm("backToTrip")}
      tripId={adventureId}
      defaultValues={tripToFormValues(trip)}
      inventory={inventory}
      equipmentCategories={categories}
      defaultEquipmentIds={defaultEquipmentIds}
    />
  );
}
