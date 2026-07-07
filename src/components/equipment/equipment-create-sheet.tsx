"use client";

import { useTranslations } from "next-intl";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useEquipmentInventory } from "@/features/equipment/hooks";
import { categoryDtoToCategory } from "@/lib/api-mappers";
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

const FORM_ID = "equipment-create-sheet-form";

interface EquipmentCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (equipmentId: string) => void;
}

export function EquipmentCreateSheet({
  open,
  onOpenChange,
  onCreated,
}: EquipmentCreateSheetProps) {
  const t = useTranslations("dashboard.pages.newEquipment");
  const tForm = useTranslations("dashboard.equipmentForm");
  const profileQuery = useCurrentProfile();
  const inventoryQuery = useEquipmentInventory();

  const isLoading =
    open && (profileQuery.isLoading || inventoryQuery.isLoading);

  const categories = (inventoryQuery.data?.categories ?? []).map(
    categoryDtoToCategory,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading || !profileQuery.data ? (
            <QueryLoading className="min-h-[30vh]" />
          ) : (
            <EquipmentForm
              mode="create"
              formId={FORM_ID}
              hideActions
              ownerId={profileQuery.data.id}
              categories={categories}
              cancelHref="#"
              onSuccess={(result) => {
                if (result?.id) {
                  onCreated(result.id);
                }
                onOpenChange(false);
              }}
            />
          )}
        </div>

        <SheetFooter className="border-t border-border px-5 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {tForm("actions.cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} variant="warm">
            {tForm("actions.create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
