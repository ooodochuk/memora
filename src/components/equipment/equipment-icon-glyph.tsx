import { createElement } from "react";
import { resolveEquipmentIcon } from "@/lib/equipment/categories";

interface EquipmentIconGlyphProps {
  icon: string;
  className?: string;
  strokeWidth?: number;
}

export function EquipmentIconGlyph({
  icon,
  className,
  strokeWidth = 1.25,
}: EquipmentIconGlyphProps) {
  return createElement(resolveEquipmentIcon(icon), {
    className,
    strokeWidth,
  });
}
