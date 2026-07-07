"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { EquipmentCategory } from "@/types";
import {
 createEquipmentCategoryFormSchema,
 emptyEquipmentCategoryFormValues,
 formValuesToCustomCategory,
 type EquipmentCategoryFormValues,
} from "@/lib/validations/equipment-category-form";
import {
 EQUIPMENT_ICON_OPTIONS,
 resolveEquipmentIcon,
} from "@/lib/equipment/categories";
import { createCustomEquipmentCategoryId } from "@/lib/equipment/category-accessors";
import { FormField } from "@/components/design-system/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EquipmentCustomCategoryFormProps {
 ownerId: string;
 defaultName?: string;
 onSave: (category: EquipmentCategory) => void;
 onCancel: () => void;
}

export function EquipmentCustomCategoryForm({
 ownerId,
 defaultName = "",
 onSave,
 onCancel,
}: EquipmentCustomCategoryFormProps) {
 const t = useTranslations("dashboard.equipmentCategoryForm");

 const schema = useMemo(
 () =>
 createEquipmentCategoryFormSchema({
 nameRequired: t("errors.nameRequired"),
 nameMin: t("errors.nameMin"),
 nameMax: t("errors.nameMax"),
 iconRequired: t("errors.iconRequired"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 formState: { errors, isSubmitting },
 } = useForm<EquipmentCategoryFormValues>({
 resolver: zodResolver(schema),
 defaultValues: {
 ...emptyEquipmentCategoryFormValues,
 name: defaultName,
 },
 });

 function onSubmit(values: EquipmentCategoryFormValues) {
 onSave(
 formValuesToCustomCategory(
 values,
 ownerId,
 createCustomEquipmentCategoryId(),
 ),
 );
 }

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-border bg-card p-4">
 <FormField
 label={t("fields.name.label")}
 htmlFor="category-name"
 hint={t("fields.name.hint")}
 error={errors.name?.message}
 >
 <Input
 id="category-name"
 autoFocus
 {...register("name")}
 aria-invalid={!!errors.name}
 />
 </FormField>

 <FormField
 label={t("fields.icon.label")}
 htmlFor="category-icon"
 hint={t("fields.icon.hint")}
 error={errors.icon?.message}
 >
 <Controller
 name="icon"
 control={control}
 render={({ field }) => (
 <div
 id="category-icon"
 className="grid grid-cols-7 gap-1.5 sm:grid-cols-8"
 role="radiogroup"
 >
 {EQUIPMENT_ICON_OPTIONS.map((iconName) => {
 const Icon = resolveEquipmentIcon(iconName);
 const selected = field.value === iconName;

 return (
 <button
 key={iconName}
 type="button"
 role="radio"
 aria-checked={selected}
 aria-label={iconName}
 onClick={() => field.onChange(iconName)}
 className={cn(
 "flex size-9 items-center justify-center rounded-lg border transition-colors",
 selected
 ? "border-primary/50 bg-primary/10 text-primary"
 : "border-border text-muted-foreground hover:border-border hover:text-foreground",
 )}
 >
 <Icon className="size-4" strokeWidth={1.75} aria-hidden />
 </button>
 );
 })}
 </div>
 )}
 />
 </FormField>

 <div className="flex justify-end gap-2">
 <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
 {t("actions.cancel")}
 </Button>
 <Button type="submit" variant="warm" size="sm" disabled={isSubmitting}>
 {t("actions.save")}
 </Button>
 </div>
 </form>
 );
}
