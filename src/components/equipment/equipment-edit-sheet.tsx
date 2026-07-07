"use client";

import { useTranslations } from "next-intl";
import { useCurrentProfile } from "@/features/auth/hooks";
import {
  useEquipmentInventory,
  useEquipmentItem,
} from "@/features/equipment/hooks";
import { categoryDtoToCategory, equipmentDtoToEquipment } from "@/lib/api-mappers";
import { equipmentToFormValues } from "@/lib/validations/equipment-form";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { QueryLoading } from "@/components/data-state/query-state";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const FORM_ID = "equipment-edit-sheet-form";

interface EquipmentEditSheetProps {
  equipmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function EquipmentEditSheet({
  equipmentId,
  open,
  onOpenChange,
  onSaved,
}: EquipmentEditSheetProps) {
  const t = useTranslations("dashboard.pages.editEquipment");
  const tForm = useTranslations("dashboard.equipmentForm");
  const profileQuery = useCurrentProfile();
  const itemQuery = useEquipmentItem(equipmentId ?? "");
  const inventoryQuery = useEquipmentInventory();

  const isLoading =
    open &&
    Boolean(equipmentId) &&
    (profileQuery.isLoading || itemQuery.isLoading || inventoryQuery.isLoading);

  const item = itemQuery.data ? equipmentDtoToEquipment(itemQuery.data) : null;
  const categories = (inventoryQuery.data?.categories ?? []).map(categoryDtoToCategory);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading || !item || !profileQuery.data ? (
            <QueryLoading className="min-h-[30vh]" />
          ) : (
            <EquipmentForm
              mode="edit"
              formId={FORM_ID}
              hideActions
              ownerId={profileQuery.data.id}
              categories={categories}
              equipmentId={equipmentId!}
              defaultValues={equipmentToFormValues(item)}
              cancelHref="#"
              onSuccess={onSaved}
            />
          )}
        </div>

        <SheetFooter className="border-t border-border px-5 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {tForm("actions.cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} variant="warm">
            {tForm("actions.save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
