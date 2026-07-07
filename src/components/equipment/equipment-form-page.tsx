"use client";

import type { EquipmentCategory } from "@/types";
import type { EquipmentFormValues } from "@/lib/validations/equipment-form";
import { EquipmentFormScreen } from "@/components/equipment/equipment-form-screen";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { useTranslations } from "next-intl";

const FORM_ID = "equipment-form";

interface EquipmentFormPageProps {
  mode: "create" | "edit";
  title: string;
  backHref: string;
  backLabel: string;
  ownerId: string;
  categories: EquipmentCategory[];
  defaultValues?: EquipmentFormValues;
  equipmentId?: string;
}

export function EquipmentFormPage({
  mode,
  title,
  backHref,
  backLabel,
  ownerId,
  categories,
  defaultValues,
  equipmentId,
}: EquipmentFormPageProps) {
  const t = useTranslations("dashboard.equipmentForm");

  return (
    <EquipmentFormScreen
      title={title}
      backHref={backHref}
      backLabel={backLabel}
      formId={FORM_ID}
      cancelLabel={t("actions.cancel")}
      submitLabel={mode === "create" ? t("actions.create") : t("actions.save")}
    >
      <EquipmentForm
        mode={mode}
        formId={FORM_ID}
        hideActions
        ownerId={ownerId}
        categories={categories}
        defaultValues={defaultValues}
        equipmentId={equipmentId}
      />
    </EquipmentFormScreen>
  );
}
