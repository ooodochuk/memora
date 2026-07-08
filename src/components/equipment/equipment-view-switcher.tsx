"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { EquipmentViewMode } from "@/hooks/use-equipment-view-mode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EquipmentViewSwitcherProps {
  value: EquipmentViewMode;
  onChange: (mode: EquipmentViewMode) => void;
  className?: string;
}

export function EquipmentViewSwitcher({
  value,
  onChange,
  className,
}: EquipmentViewSwitcherProps) {
  const t = useTranslations("dashboard.pages.equipment.viewMode");

  const options: { mode: EquipmentViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: "cards", icon: LayoutGrid, label: t("cards") },
    { mode: "table", icon: Table2, label: t("table") },
  ];

  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-lg border border-border bg-card p-0.5",
        className,
      )}
      role="group"
      aria-label={t("label")}
    >
      {options.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          type="button"
          variant={value === mode ? "secondary" : "ghost"}
          size="sm"
          className="h-8 gap-1.5 rounded-md px-2.5 sm:px-3"
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
        >
          <Icon className="size-4" aria-hidden />
          <span className="text-xs sm:text-sm">{label}</span>
        </Button>
      ))}
    </div>
  );
}
