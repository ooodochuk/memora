"use client";

import { useTranslations } from "next-intl";
import { useEquipmentInventory } from "@/features/equipment/hooks";
import { QueryLoading, QueryState } from "@/components/data-state/query-state";
import { TripFormPage } from "@/components/dashboard/trip/trip-form-page";
import { dashboardRoutes } from "@/constants/routes";
import {
  categoryDtoToCategory,
  equipmentDtoToEquipment,
} from "@/lib/api-mappers";

export function NewTripPageClient() {
  const t = useTranslations("dashboard.pages.newTrip");
  const tForm = useTranslations("dashboard.tripForm");
  const inventoryQuery = useEquipmentInventory();

  if (inventoryQuery.isLoading) {
    return <QueryLoading className="min-h-[40vh]" />;
  }

  return (
    <QueryState query={inventoryQuery} loading={<QueryLoading className="min-h-[40vh]" />}>
      {(inventory) => (
        <TripFormPage
          mode="create"
          title={t("title")}
          backHref={dashboardRoutes.trips()}
          backLabel={tForm("backToTrips")}
          inventory={inventory.items
            .map(equipmentDtoToEquipment)
            .filter((item) => item.isActive)}
          equipmentCategories={inventory.categories.map(categoryDtoToCategory)}
        />
      )}
    </QueryState>
  );
}
