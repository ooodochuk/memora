"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ResponsiveFormScreen } from "@/components/design-system/responsive-form-screen";
import { Button } from "@/components/ui/button";

interface TripFormScreenProps {
  title: string;
  backHref: string;
  backLabel: string;
  formId: string;
  submitLabel: string;
  cancelLabel: string;
  size?: "default" | "wide";
  children: ReactNode;
}

export function TripFormScreen({
  title,
  backHref,
  backLabel,
  formId,
  submitLabel,
  cancelLabel,
  size = "wide",
  children,
}: TripFormScreenProps) {
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

export function useTripFormScreenLabels(mode: "create" | "edit") {
  const t = useTranslations("dashboard.tripForm");
  return {
    cancelLabel: t("actions.cancel"),
    submitLabel:
      mode === "create" ? t("actions.create") : t("actions.save"),
  };
}
