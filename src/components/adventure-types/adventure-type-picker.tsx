"use client";

import { useTranslations } from "next-intl";
import type { AdventureType } from "@/types";
import {
 ADVENTURE_TYPE_OPTIONS,
 adventureTypeIcons,
 adventureTypeStyles,
} from "@/lib/adventure-types";
import { cn } from "@/lib/utils";

interface AdventureTypePickerProps {
 value: AdventureType | "";
 onChange: (type: AdventureType) => void;
 className?: string;
}

export function AdventureTypePicker({
 value,
 onChange,
 className,
}: AdventureTypePickerProps) {
 const t = useTranslations("adventureTypes");
 const tTypes = useTranslations("adventureTypes.types");

 return (
 <div
 className={cn(
 "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
 className,
 )}
 role="radiogroup"
 aria-label={t("pickerLabel")}
 >
 {ADVENTURE_TYPE_OPTIONS.map((type) => {
 const Icon = adventureTypeIcons[type];
 const colors = adventureTypeStyles[type];
 const selected = value === type;

 return (
 <button
 key={type}
 type="button"
 role="radio"
 aria-checked={selected}
 onClick={() => onChange(type)}
 className={cn(
 "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all",
 "hover:border-border",
 selected
 ? "border-primary/50 ring-1 ring-ring/25"
 : "border-border bg-card",
 )}
 style={
 selected
 ? { backgroundColor: colors.bg, color: colors.fg }
 : undefined
 }
 >
 <Icon
 className={cn(
 "size-5 shrink-0",
 selected ? "" : "text-muted-foreground",
 )}
 strokeWidth={1.75}
 aria-hidden
 />
 <span
 className={cn(
 "text-xs font-medium leading-tight",
 selected ? "text-foreground" : "text-muted-foreground",
 )}
 >
 {tTypes(type)}
 </span>
 </button>
 );
 })}
 </div>
 );
}
