"use client";

import type { ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { ResponsiveFormScreen } from "@/components/design-system/responsive-form-screen";
import { Button } from "@/components/ui/button";

interface EquipmentFormScreenProps {
  title: string;
  backHref: string;
  backLabel: string;
  formId: string;
  submitLabel: string;
  cancelLabel: string;
  size?: "default" | "wide";
  children: ReactNode;
}

export function EquipmentFormScreen({
  title,
  backHref,
  backLabel,
  formId,
  submitLabel,
  cancelLabel,
  size = "wide",
  children,
}: EquipmentFormScreenProps) {
  const router = useRouter();

  return (
    <ResponsiveFormScreen
      title={title}
      backHref={backHref}
      backLabel={backLabel}
      size={size}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="h-12 sm:h-10"
            onClick={() => router.push(backHref)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="warm"
            size="lg"
            className="h-12 min-w-[140px] sm:h-10"
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      {children}
    </ResponsiveFormScreen>
  );
}
