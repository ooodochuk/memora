"use client";

import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { isApiError } from "@/api/errors";
import { useCurrentProfile } from "@/features/auth/hooks";
import {
  useEquipmentInventory,
  useEquipmentItem,
} from "@/features/equipment/hooks";
import { QueryError, QueryLoading } from "@/components/data-state/query-state";
import { EquipmentFormPage } from "@/components/equipment/equipment-form-page";
import { dashboardRoutes } from "@/constants/routes";
import {
  categoryDtoToCategory,
  equipmentDtoToEquipment,
} from "@/lib/api-mappers";
import { equipmentToFormValues } from "@/lib/validations/equipment-form";

interface EditEquipmentPageClientProps {
  equipmentId: string;
}

export function EditEquipmentPageClient({
  equipmentId,
}: EditEquipmentPageClientProps) {
  const t = useTranslations("dashboard.pages.editEquipment");
  const tForm = useTranslations("dashboard.equipmentForm");
  const profileQuery = useCurrentProfile();
  const itemQuery = useEquipmentItem(equipmentId);
  const inventoryQuery = useEquipmentInventory();

  const isLoading =
    profileQuery.isLoading || itemQuery.isLoading || inventoryQuery.isLoading;

  if (isLoading) {
    return <QueryLoading className="min-h-[40vh]" />;
  }

  const failedQuery = profileQuery.isError
    ? profileQuery
    : itemQuery.isError
      ? itemQuery
      : inventoryQuery.isError
        ? inventoryQuery
        : null;

  if (failedQuery) {
    if (failedQuery === itemQuery && isApiError(itemQuery.error) && itemQuery.error.status === 404) {
      notFound();
    }

    return (
      <QueryError
        error={failedQuery.error}
        onRetry={() => failedQuery.refetch()}
        className="min-h-[40vh]"
      />
    );
  }

  if (!profileQuery.data || !itemQuery.data) {
    return null;
  }

  const item = equipmentDtoToEquipment(itemQuery.data);
  const categories = (inventoryQuery.data?.categories ?? []).map(
    categoryDtoToCategory,
  );

  return (
    <EquipmentFormPage
      mode="edit"
      title={t("title")}
      backHref={dashboardRoutes.equipmentItem(equipmentId)}
      backLabel={tForm("backToItem")}
      ownerId={profileQuery.data.id}
      categories={categories}
      equipmentId={equipmentId}
      defaultValues={equipmentToFormValues(item)}
    />
  );
}
