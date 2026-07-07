"use client";

import { useMemo, useState } from "react";
import { isMockMode } from "@/api/config";
import { useTranslations } from "next-intl";
import type { EquipmentCategory } from "@/types";
import {
 getEquipmentCategoryLabel,
 resolveEquipmentIcon,
} from "@/lib/equipment/categories";
import { EquipmentCustomCategoryForm } from "@/components/equipment/equipment-custom-category-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCategorySelectorProps {
 ownerId: string;
 categories: EquipmentCategory[];
 value?: string;
 onChange: (categoryId: string) => void;
 onCreateCategory: (category: EquipmentCategory) => void;
 error?: string;
 className?: string;
}

export function EquipmentCategorySelector({
 ownerId,
 categories,
 value,
 onChange,
 onCreateCategory,
 error,
 className,
}: EquipmentCategorySelectorProps) {
 const t = useTranslations("dashboard.equipmentCategorySelector");
 const tDefault = useTranslations("equipment.defaultCategories");
 const mockMode = isMockMode();
 const [query, setQuery] = useState("");
 const [creating, setCreating] = useState(false);

 const selected = categories.find((category) => category.id === value);

 const filtered = useMemo(() => {
 const normalized = query.trim().toLowerCase();
 if (!normalized) return categories;

 return categories.filter((category) => {
 const label = getEquipmentCategoryLabel(category, tDefault);
 return label.toLowerCase().includes(normalized);
 });
 }, [categories, query, tDefault]);

 const showAddCustom =
 !creating &&
 query.trim().length > 0 &&
 filtered.length === 0;

 function handleCreate(category: EquipmentCategory) {
 onCreateCategory(category);
 onChange(category.id);
 setCreating(false);
 setQuery("");
 }

 function labelFor(category: EquipmentCategory): string {
 return getEquipmentCategoryLabel(category, tDefault);
 }

 return (
 <div className={cn("space-y-3", className)}>
 {selected && !creating && (
 <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5">
 {(() => {
 const Icon = resolveEquipmentIcon(selected.icon);
 return (
 <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
 <Icon className="size-4" strokeWidth={1.75} aria-hidden />
 </span>
 );
 })()}
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-medium">{labelFor(selected)}</p>
 {!selected.isDefault && (
 <p className="truncate text-xs text-muted-foreground">
 {t("customCategoryBadge")}
 </p>
 )}
 </div>
 </div>
 )}

 {!creating ? (
 <>
 <Input
 type="search"
 value={query}
 onChange={(event) => setQuery(event.target.value)}
 placeholder={t("searchPlaceholder")}
 aria-invalid={!!error}
 aria-describedby={error ? "category-error" : undefined}
 />

 {filtered.length > 0 && (
 <ul
 className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-border p-1"
 role="listbox"
 >
 {filtered.map((category) => {
 const Icon = resolveEquipmentIcon(category.icon);
 const isSelected = category.id === value;

 return (
 <li key={category.id}>
 <button
 type="button"
 role="option"
 aria-selected={isSelected}
 onClick={() => {
 onChange(category.id);
 setQuery("");
 }}
 className={cn(
 "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
 isSelected
 ? "bg-primary/10 text-foreground"
 : "hover:bg-card",
 )}
 >
 <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card text-primary">
 <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
 </span>
 <span className="min-w-0 flex-1 truncate">
 {labelFor(category)}
 </span>
 {!category.isDefault && (
 <Tag className="size-3 shrink-0 text-muted-foreground" />
 )}
 </button>
 </li>
 );
 })}
 </ul>
 )}

 {query.trim().length === 0 && filtered.length === 0 && (
 <p className="text-xs text-muted-foreground">{t("searchHint")}</p>
 )}

 {showAddCustom && mockMode && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 className="w-full gap-1.5 border-dashed"
 onClick={() => setCreating(true)}
 >
 <Plus className="size-3.5 text-primary" />
 {t("addCustomCategory")}
 </Button>
 )}

 {mockMode && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="h-auto gap-1.5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
 onClick={() => setCreating(true)}
 >
 <Plus className="size-3.5 text-primary" />
 {t("addCustomCategory")}
 </Button>
 )}
 </>
 ) : mockMode ? (
 <EquipmentCustomCategoryForm
 ownerId={ownerId}
 defaultName={query.trim()}
 onSave={handleCreate}
 onCancel={() => setCreating(false)}
 />
 ) : null}

 {error && (
 <p id="category-error" className="text-xs text-destructive" role="alert">
 {error}
 </p>
 )}
 </div>
 );
}
