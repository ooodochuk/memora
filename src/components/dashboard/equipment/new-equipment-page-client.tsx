"use client";

import { useTranslations } from "next-intl";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useEquipmentInventory } from "@/features/equipment/hooks";
import { QueryError, QueryLoading } from "@/components/data-state/query-state";
import { EquipmentFormPage } from "@/components/equipment/equipment-form-page";
import { dashboardRoutes } from "@/constants/routes";
import { categoryDtoToCategory } from "@/lib/api-mappers";

export function NewEquipmentPageClient() {
  const t = useTranslations("dashboard.pages.newEquipment");
  const tForm = useTranslations("dashboard.equipmentForm");
  const profileQuery = useCurrentProfile();
  const inventoryQuery = useEquipmentInventory();

  const isLoading = profileQuery.isLoading || inventoryQuery.isLoading;

  if (isLoading) {
    return <QueryLoading className="min-h-[40vh]" />;
  }

  const failedQuery = profileQuery.isError
    ? profileQuery
    : inventoryQuery.isError
      ? inventoryQuery
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

  if (!profileQuery.data) {
    return null;
  }

  const categories = (inventoryQuery.data?.categories ?? []).map(
    categoryDtoToCategory,
  );

  return (
    <EquipmentFormPage
      mode="create"
      title={t("title")}
      backHref={dashboardRoutes.equipment()}
      backLabel={tForm("backToEquipment")}
      ownerId={profileQuery.data.id}
      categories={categories}
    />
  );
}
