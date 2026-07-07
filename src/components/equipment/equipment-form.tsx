"use client";

import { useMemo, useState } from "react";
import { useCreateEquipment, useUpdateEquipment } from "@/features/equipment/hooks";
import { isMockMode } from "@/api/config";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ImageIcon, Package, PenLine, Scale, Sparkles } from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import type { EquipmentCategory } from "@/types";
import {
 createEquipmentFormSchema,
 emptyEquipmentFormValues,
 type EquipmentFormValues,
} from "@/lib/validations/equipment-form";
import { formatWeightGrams } from "@/lib/equipment/categories";
import { EquipmentCategorySelector } from "@/components/equipment/equipment-category-selector";
import { FormField } from "@/components/design-system/form-field";
import { JournalCard } from "@/components/design-system/journal-card";
import { Eyebrow } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

interface EquipmentFormProps {
 mode: "create" | "edit";
 formId?: string;
 hideActions?: boolean;
 ownerId: string;
 categories: EquipmentCategory[];
 defaultValues?: EquipmentFormValues;
 equipmentId?: string;
}

function FormSection({
 icon: Icon,
 eyebrow,
 title,
 description,
 children,
}: {
 icon: LucideIcon;
 eyebrow: string;
 title: string;
 description: string;
 children: React.ReactNode;
}) {
 return (
 <JournalCard padding="md" className="space-y-5">
 <div className="flex gap-3">
 <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-primary">
 <Icon className="size-4" strokeWidth={1.75} />
 </div>
 <div className="space-y-1">
 <Eyebrow>{eyebrow}</Eyebrow>
 <h2 className="font-heading text-lg font-medium tracking-tight">
 {title}
 </h2>
 <p className="text-sm leading-relaxed text-muted-foreground">
 {description}
 </p>
 </div>
 </div>
 {children}
 </JournalCard>
 );
}

export function EquipmentForm({
 mode,
 formId = "equipment-form",
 hideActions = false,
 ownerId,
 categories: initialCategories,
 defaultValues,
 equipmentId,
}: EquipmentFormProps) {
 const t = useTranslations("dashboard.equipmentForm");
 const router = useRouter();
 const mockMode = isMockMode();
 const createEquipment = useCreateEquipment();
 const updateEquipment = useUpdateEquipment(equipmentId ?? "");
 const [submitted, setSubmitted] = useState(false);
 const [photoPreviewError, setPhotoPreviewError] = useState(false);
 const [sessionCategories, setSessionCategories] = useState<EquipmentCategory[]>(
 [],
 );

 const allCategories = useMemo(
 () => [...initialCategories, ...sessionCategories],
 [initialCategories, sessionCategories],
 );

 const schema = useMemo(
 () =>
 createEquipmentFormSchema({
 nameRequired: t("errors.nameRequired"),
 brandRequired: t("errors.brandRequired"),
 modelRequired: t("errors.modelRequired"),
 categoryRequired: t("errors.categoryRequired"),
 weightMin: t("errors.weightMin"),
 weightMax: t("errors.weightMax"),
 priceMin: t("errors.priceMin"),
 photoUrlInvalid: t("errors.photoUrlInvalid"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 watch,
 formState: { errors, isSubmitting },
 } = useForm<EquipmentFormValues>({
 resolver: zodResolver(schema),
 defaultValues: defaultValues ?? emptyEquipmentFormValues,
 });

 const photoUrl = watch("photoUrl");
 const weightGrams = watch("weightGrams");

 async function onSubmit(values: EquipmentFormValues) {
 if (mockMode) {
 await new Promise((resolve) => setTimeout(resolve, 900));
 setSubmitted(true);
 window.setTimeout(() => {
 router.push(dashboardRoutes.equipment());
 }, 1200);
 return;
 }

 const payload = {
 name: values.name,
 categoryId: values.categoryId,
 brand: values.brand,
 model: values.model,
 weightGrams: values.weightGrams,
 ...(values.purchaseDate ? { purchaseDate: values.purchaseDate } : {}),
 ...(Number.isFinite(values.purchasePrice)
 ? { purchasePrice: values.purchasePrice }
 : {}),
 ...(values.notes ? { notes: values.notes } : {}),
 ...(values.photoUrl ? { photoUrl: values.photoUrl } : {}),
 isActive: values.isActive,
 };

 if (mode === "create") {
 await createEquipment.mutateAsync(payload);
 } else if (equipmentId) {
 await updateEquipment.mutateAsync(payload);
 }
 router.push(dashboardRoutes.equipment());
 }

 const cancelHref = dashboardRoutes.equipment();

 return (
 <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 <FormSection
 icon={PenLine}
 eyebrow={t("sections.identity.eyebrow")}
 title={t("sections.identity.title")}
 description={t("sections.identity.description")}
 >
 <div className="grid gap-5 sm:grid-cols-2">
 <FormField
 label={t("fields.name.label")}
 htmlFor="name"
 hint={t("fields.name.hint")}
 error={errors.name?.message}
 >
 <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
 </FormField>

 <FormField
 label={t("fields.category.label")}
 htmlFor="category"
 error={errors.categoryId?.message}
 >
 <Controller
 name="categoryId"
 control={control}
 render={({ field }) => (
 <EquipmentCategorySelector
 ownerId={ownerId}
 categories={allCategories}
 value={field.value || undefined}
 onChange={field.onChange}
 onCreateCategory={(category) =>
 setSessionCategories((prev) => [...prev, category])
 }
 error={errors.categoryId?.message}
 />
 )}
 />
 </FormField>

 <FormField
 label={t("fields.brand.label")}
 htmlFor="brand"
 error={errors.brand?.message}
 >
 <Input id="brand" {...register("brand")} aria-invalid={!!errors.brand} />
 </FormField>

 <FormField
 label={t("fields.model.label")}
 htmlFor="model"
 error={errors.model?.message}
 >
 <Input id="model" {...register("model")} aria-invalid={!!errors.model} />
 </FormField>
 </div>
 </FormSection>

 <FormSection
 icon={Scale}
 eyebrow={t("sections.specs.eyebrow")}
 title={t("sections.specs.title")}
 description={t("sections.specs.description")}
 >
 <div className="grid gap-5 sm:grid-cols-3">
 <FormField
 label={t("fields.weightGrams.label")}
 htmlFor="weightGrams"
 hint={
 weightGrams > 0
 ? formatWeightGrams(weightGrams)
 : t("fields.weightGrams.hint")
 }
 error={errors.weightGrams?.message}
 >
 <Input
 id="weightGrams"
 type="number"
 min={1}
 {...register("weightGrams", { valueAsNumber: true })}
 aria-invalid={!!errors.weightGrams}
 />
 </FormField>

 <FormField
 label={t("fields.purchaseDate.label")}
 htmlFor="purchaseDate"
 hint={t("fields.purchaseDate.hint")}
 >
 <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
 </FormField>

 <FormField
 label={t("fields.purchasePrice.label")}
 htmlFor="purchasePrice"
 hint={t("fields.purchasePrice.hint")}
 error={errors.purchasePrice?.message}
 >
 <Input
 id="purchasePrice"
 type="number"
 min={0}
 step={1}
 {...register("purchasePrice", { valueAsNumber: true })}
 />
 </FormField>
 </div>
 </FormSection>

 <FormSection
 icon={Package}
 eyebrow={t("sections.details.eyebrow")}
 title={t("sections.details.title")}
 description={t("sections.details.description")}
 >
 <div className="space-y-5">
 <FormField
 label={t("fields.notes.label")}
 htmlFor="notes"
 hint={t("fields.notes.hint")}
 >
 <Textarea id="notes" rows={4} {...register("notes")} />
 </FormField>

 <FormField
 label={t("fields.isActive.label")}
 htmlFor="isActive"
 hint={t("fields.isActive.hint")}
 >
 <Controller
 name="isActive"
 control={control}
 render={({ field }) => (
 <Select
 value={field.value ? "active" : "inactive"}
 onValueChange={(value) => field.onChange(value === "active")}
 >
 <SelectTrigger id="isActive" className="w-full sm:max-w-xs">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="active">{t("fields.isActive.active")}</SelectItem>
 <SelectItem value="inactive">
 {t("fields.isActive.inactive")}
 </SelectItem>
 </SelectContent>
 </Select>
 )}
 />
 </FormField>
 </div>
 </FormSection>

 <FormSection
 icon={ImageIcon}
 eyebrow={t("sections.photo.eyebrow")}
 title={t("sections.photo.title")}
 description={t("sections.photo.description")}
 >
 <FormField
 label={t("fields.photoUrl.label")}
 htmlFor="photoUrl"
 hint={t("fields.photoUrl.hint")}
 error={errors.photoUrl?.message}
 >
 <Input id="photoUrl" {...register("photoUrl")} />
 </FormField>

 <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/40">
 <div className="relative aspect-[16/10] max-h-56 w-full">
 {photoUrl && !photoPreviewError ? (
 <Image
 src={photoUrl}
 alt=""
 fill
 className="object-cover"
 onError={() => setPhotoPreviewError(true)}
 onLoad={() => setPhotoPreviewError(false)}
 />
 ) : (
 <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
 <ImageIcon className="size-8 opacity-40" />
 <p className="text-xs">{t("fields.photoUrl.previewEmpty")}</p>
 </div>
 )}
 </div>
 </div>
 </FormSection>

 {!hideActions && (
 <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
 <Button variant="outline" render={<Link href={cancelHref} />}>
 {t("actions.cancel")}
 </Button>
 <Button
 type="submit"
 variant="warm"
 disabled={isSubmitting || submitted}
 className="gap-2"
 >
 <Sparkles className="size-4" />
 {submitted
 ? t("actions.saved")
 : mode === "create"
 ? t("actions.create")
 : t("actions.save")}
 </Button>
 </div>
 )}
 </form>
 );
}
