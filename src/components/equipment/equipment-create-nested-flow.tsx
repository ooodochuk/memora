"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useEquipmentInventory } from "@/features/equipment/hooks";
import { categoryDtoToCategory } from "@/lib/api-mappers";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { QueryLoading } from "@/components/data-state/query-state";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const FORM_ID = "equipment-create-nested-form";

interface EquipmentCreateFormBodyProps {
  onCancel: () => void;
  onCreated: (equipmentId: string) => void;
}

function EquipmentCreateFormBody({
  onCancel,
  onCreated,
}: EquipmentCreateFormBodyProps) {
  const tForm = useTranslations("dashboard.equipmentForm");
  const profileQuery = useCurrentProfile();
  const inventoryQuery = useEquipmentInventory();

  const isLoading = profileQuery.isLoading || inventoryQuery.isLoading;
  const categories = (inventoryQuery.data?.categories ?? []).map(
    categoryDtoToCategory,
  );

  if (isLoading || !profileQuery.data) {
    return <QueryLoading className="min-h-[30vh]" />;
  }

  return (
    <>
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
        }}
      />
      <div className="sr-only">
        <Button type="button" onClick={onCancel}>
          {tForm("actions.cancel")}
        </Button>
      </div>
    </>
  );
}

interface EquipmentCreateNestedFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (equipmentId: string) => void;
}

export function EquipmentCreateNestedFlow({
  open,
  onOpenChange,
  onCreated,
}: EquipmentCreateNestedFlowProps) {
  const t = useTranslations("dashboard.pages.newEquipment");
  const tForm = useTranslations("dashboard.equipmentForm");
  const tCommon = useTranslations("common");
  const isDesktop = useIsDesktop(768);

  useEffect(() => {
    if (!open || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDesktop]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreated(equipmentId: string) {
    onCreated(equipmentId);
    onOpenChange(false);
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose}>
        {tForm("actions.cancel")}
      </Button>
      <Button type="submit" form={FORM_ID} variant="warm">
        {tForm("actions.create")}
      </Button>
    </>
  );

  if (!open) {
    return null;
  }

  if (!isDesktop) {
    const mobileView = (
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-background",
          "animate-in slide-in-from-right duration-200",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-create-nested-title"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 gap-1 px-2"
            onClick={handleClose}
          >
            <ChevronLeft className="size-5" />
            {tCommon("back")}
          </Button>
          <h1
            id="equipment-create-nested-title"
            className="min-w-0 flex-1 truncate pr-2 text-center font-heading text-base font-medium tracking-tight"
          >
            {t("title")}
          </h1>
          <span className="size-10 shrink-0" aria-hidden />
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <EquipmentCreateFormBody
            onCancel={handleClose}
            onCreated={handleCreated}
          />
        </div>

        <footer className="shrink-0 border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        </footer>
      </div>
    );

    return createPortal(mobileView, document.body);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-xl lg:max-w-2xl"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <EquipmentCreateFormBody
            onCancel={handleClose}
            onCreated={handleCreated}
          />
        </div>

        <SheetFooter className="border-t border-border px-5 py-4">
          {footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
