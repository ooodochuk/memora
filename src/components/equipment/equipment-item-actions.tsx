"use client";

import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Equipment } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface EquipmentItemActionsProps {
  item: Equipment;
  onEdit: (item: Equipment) => void;
  onToggleActive: (item: Equipment) => void;
  onDelete: (item: Equipment) => void;
  align?: "start" | "end" | "center";
  triggerClassName?: string;
}

export function EquipmentItemActions({
  item,
  onEdit,
  onToggleActive,
  onDelete,
  align = "end",
  triggerClassName,
}: EquipmentItemActionsProps) {
  const tActions = useTranslations("dashboard.equipmentActions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("size-8 shrink-0", triggerClassName)}
            aria-label={tActions("menu")}
            onClick={(event) => event.stopPropagation()}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEdit(item);
          }}
        >
          <Pencil className="size-4" />
          {tActions("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onToggleActive(item);
          }}
        >
          <Power className="size-4" />
          {item.isActive ? tActions("deactivate") : tActions("activate")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 className="size-4" />
          {tActions("deleteLabel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
