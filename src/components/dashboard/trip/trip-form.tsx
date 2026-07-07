"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { isMockMode } from "@/api/config";
import { useCreateAdventure, useUpdateAdventure, adventureKeys } from "@/features/adventures/hooks";
import {
  attachEquipmentToAdventure,
  syncAdventureEquipment,
} from "@/features/equipment/api";
import { equipmentKeys } from "@/features/equipment/hooks";
import { tripFormToCreateAdventure } from "@/lib/api-mappers";
import {
 CalendarRange,
 Globe2,
 ImageIcon,
 MapPin,
 PenLine,
 Sparkles,
 Backpack,
 type LucideIcon,
} from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import { EquipmentSelector } from "@/components/equipment";
import { AdventureTypePicker } from "@/components/adventure-types";
import type { Equipment, EquipmentCategory } from "@/types";
import {
 createTripFormSchema,
 emptyTripFormValues,
 TRIP_STATUS_OPTIONS,
 TRIP_VISIBILITY_OPTIONS,
 type TripFormInputValues,
 type TripFormValues,
} from "@/lib/validations/trip-form";
import { FormField } from "@/components/design-system/form-field";
import { JournalCard } from "@/components/design-system/journal-card";
import { Eyebrow } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TripFormProps {
 mode: "create" | "edit";
 formId?: string;
 hideActions?: boolean;
 defaultValues?: TripFormInputValues;
 tripId?: string;
 inventory?: Equipment[];
 equipmentCategories?: EquipmentCategory[];
 defaultEquipmentIds?: string[];
}

interface FormSectionProps {
 eyebrow: string;
 title: string;
 description?: string;
 icon: LucideIcon;
 children: React.ReactNode;
 className?: string;
}

function FormSection({
 eyebrow,
 title,
 description,
 icon: Icon,
 children,
 className,
}: FormSectionProps) {
 return (
 <JournalCard padding="lg" className={className}>
 <div className="mb-6 flex items-start gap-4">
 <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary">
 <Icon className="size-4" strokeWidth={1.75} />
 </div>
 <div className="space-y-1">
 <Eyebrow>{eyebrow}</Eyebrow>
 <h2 className="font-heading text-xl font-medium tracking-tight sm:text-2xl">
 {title}
 </h2>
 {description && (
 <p className="text-sm leading-relaxed text-muted-foreground">
 {description}
 </p>
 )}
 </div>
 </div>
 {children}
 </JournalCard>
 );
}

export function TripForm({
 mode,
 formId = "trip-form",
 hideActions = false,
 defaultValues,
 tripId,
 inventory = [],
 equipmentCategories = [],
 defaultEquipmentIds = [],
}: TripFormProps) {
 const t = useTranslations("dashboard.tripForm");
 const tStatus = useTranslations("designSystem.status");
 const tVisibility = useTranslations("designSystem.visibility");
 const router = useRouter();
 const queryClient = useQueryClient();
 const mockMode = isMockMode();
 const createAdventure = useCreateAdventure();
 const updateAdventure = useUpdateAdventure(tripId ?? "");
 const [submitted, setSubmitted] = useState(false);
 const [coverPreviewError, setCoverPreviewError] = useState(false);
 const [selectedEquipmentIds, setSelectedEquipmentIds] =
 useState<string[]>(defaultEquipmentIds);

 const schema = useMemo(
 () =>
 createTripFormSchema({
 titleRequired: t("errors.titleRequired"),
 titleMin: t("errors.titleMin"),
 titleMax: t("errors.titleMax"),
 descriptionRequired: t("errors.descriptionRequired"),
 descriptionMin: t("errors.descriptionMin"),
 countryRequired: t("errors.countryRequired"),
 regionRequired: t("errors.regionRequired"),
 startDateRequired: t("errors.startDateRequired"),
 endDateBeforeStart: t("errors.endDateBeforeStart"),
 coverUrlRequired: t("errors.coverUrlRequired"),
 coverUrlInvalid: t("errors.coverUrlInvalid"),
 adventureTypeRequired: t("errors.adventureTypeRequired"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 watch,
 formState: { errors, isSubmitting },
 } = useForm<TripFormInputValues>({
 resolver: zodResolver(schema),
 defaultValues: defaultValues ?? emptyTripFormValues,
 });

 const coverImageUrl = watch("coverImageUrl");

 async function onSubmit(values: TripFormInputValues) {
 if (mockMode) {
 await new Promise((resolve) => setTimeout(resolve, 900));
 setSubmitted(true);
 window.setTimeout(() => {
 if (mode === "edit" && tripId) {
 router.push(dashboardRoutes.trip(tripId));
 } else {
 router.push(dashboardRoutes.trips());
 }
 }, 1400);
 return;
 }

 try {
 if (mode === "create") {
 const adventure = await createAdventure.mutateAsync(
 tripFormToCreateAdventure(values as TripFormValues),
 );
 for (const equipmentId of selectedEquipmentIds) {
 await attachEquipmentToAdventure(adventure.id, equipmentId);
 }
 router.push(dashboardRoutes.trip(adventure.id));
 return;
 }

 if (mode === "edit" && tripId) {
 await updateAdventure.mutateAsync(tripFormToCreateAdventure(values as TripFormValues));
 await syncAdventureEquipment(tripId, selectedEquipmentIds, defaultEquipmentIds);
 await queryClient.invalidateQueries({
 queryKey: equipmentKeys.byAdventure(tripId),
 });
 await queryClient.refetchQueries({ queryKey: adventureKeys.detail(tripId) });
 router.refresh();
 router.push(dashboardRoutes.trip(tripId));
 }
 } catch {
 // mutation error surfaces via form state if needed
 }
 }

 const cancelHref =
 mode === "edit" && tripId
 ? dashboardRoutes.trip(tripId)
 : dashboardRoutes.trips();

 const isCreate = mode === "create";

 return (
 <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 <FormSection
 icon={PenLine}
 eyebrow={t("sections.story.eyebrow")}
 title={t("sections.story.title")}
 description={isCreate ? undefined : t("sections.story.description")}
 >
 <div className="space-y-5">
 <FormField
 label={t("fields.adventureType.label")}
 htmlFor="adventureType"
 error={errors.adventureType?.message}
 >
 <Controller
 name="adventureType"
 control={control}
 render={({ field }) => (
 <AdventureTypePicker
 value={field.value}
 onChange={field.onChange}
 />
 )}
 />
 </FormField>

 <FormField
 label={t("fields.title.label")}
 htmlFor="title"
 hint={isCreate ? undefined : t("fields.title.hint")}
 error={errors.title?.message}
 >
 <Input
 id="title"
 placeholder={t("fields.title.placeholder")}
 aria-invalid={!!errors.title}
 className="font-heading text-base sm:text-lg"
 {...register("title")}
 />
 </FormField>

 <FormField
 label={t("fields.description.label")}
 htmlFor="description"
 hint={isCreate ? undefined : t("fields.description.hint")}
 error={errors.description?.message}
 >
 <Textarea
 id="description"
 rows={5}
 placeholder={t("fields.description.placeholder")}
 aria-invalid={!!errors.description}
 {...register("description")}
 />
 </FormField>
 </div>
 </FormSection>

 <div className="grid gap-6 lg:grid-cols-2">
 <FormSection
 icon={MapPin}
 eyebrow={t("sections.place.eyebrow")}
 title={t("sections.place.title")}
 description={isCreate ? undefined : t("sections.place.description")}
 >
 <div className="space-y-5">
 <FormField
 label={t("fields.country.label")}
 htmlFor="country"
 hint={isCreate ? undefined : t("fields.country.hint")}
 error={errors.country?.message}
 >
 <Input
 id="country"
 placeholder={t("fields.country.placeholder")}
 aria-invalid={!!errors.country}
 {...register("country")}
 />
 </FormField>

 <FormField
 label={t("fields.region.label")}
 htmlFor="region"
 hint={isCreate ? undefined : t("fields.region.hint")}
 error={errors.region?.message}
 >
 <Input
 id="region"
 placeholder={t("fields.region.placeholder")}
 aria-invalid={!!errors.region}
 {...register("region")}
 />
 </FormField>
 </div>
 </FormSection>

 <FormSection
 icon={CalendarRange}
 eyebrow={t("sections.dates.eyebrow")}
 title={t("sections.dates.title")}
 description={isCreate ? undefined : t("sections.dates.description")}
 >
 <div className="grid gap-5 sm:grid-cols-2">
 <FormField
 label={t("fields.startDate.label")}
 htmlFor="startDate"
 hint={isCreate ? undefined : t("fields.startDate.hint")}
 error={errors.startDate?.message}
 >
 <Input
 id="startDate"
 type="date"
 aria-invalid={!!errors.startDate}
 {...register("startDate")}
 />
 </FormField>

 <FormField
 label={t("fields.endDate.label")}
 htmlFor="endDate"
 hint={isCreate ? undefined : t("fields.endDate.hint")}
 error={errors.endDate?.message}
 >
 <Input
 id="endDate"
 type="date"
 aria-invalid={!!errors.endDate}
 {...register("endDate")}
 />
 </FormField>
 </div>
 </FormSection>
 </div>

 <FormSection
 icon={ImageIcon}
 eyebrow={t("sections.cover.eyebrow")}
 title={t("sections.cover.title")}
 description={isCreate ? undefined : t("sections.cover.description")}
 >
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
 <FormField
 label={t("fields.coverImageUrl.label")}
 htmlFor="coverImageUrl"
 hint={isCreate ? undefined : t("fields.coverImageUrl.hint")}
 error={errors.coverImageUrl?.message}
 >
 <Input
 id="coverImageUrl"
 type="url"
 placeholder={t("fields.coverImageUrl.placeholder")}
 aria-invalid={!!errors.coverImageUrl}
 {...register("coverImageUrl", {
 onChange: () => setCoverPreviewError(false),
 })}
 />
 </FormField>

 <div
 className={cn(
 "relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted",
 !coverImageUrl && "flex items-center justify-center",
 )}
 >
 {coverImageUrl && !coverPreviewError ? (
 <Image
 src={coverImageUrl}
 alt={t("fields.coverImageUrl.previewAlt")}
 fill
 className="object-cover"
 sizes="240px"
 onError={() => setCoverPreviewError(true)}
 />
 ) : (
 <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
 <ImageIcon className="size-8 opacity-40" strokeWidth={1.25} />
 <p className="text-xs leading-relaxed">
 {coverPreviewError
 ? t("fields.coverImageUrl.previewError")
 : t("fields.coverImageUrl.previewEmpty")}
 </p>
 </div>
 )}
 </div>
 </div>
 </FormSection>

 <FormSection
 icon={Globe2}
 eyebrow={t("sections.sharing.eyebrow")}
 title={t("sections.sharing.title")}
 description={isCreate ? undefined : t("sections.sharing.description")}
 >
 <div className="grid gap-5 sm:grid-cols-2">
 <FormField
 label={t("fields.visibility.label")}
 htmlFor="visibility"
 error={errors.visibility?.message}
 >
 <Controller
 name="visibility"
 control={control}
 render={({ field }) => (
 <Select value={field.value} onValueChange={field.onChange}>
 <SelectTrigger
 id="visibility"
 className="h-11 w-full rounded-xl sm:h-10"
 aria-invalid={!!errors.visibility}
 >
 <SelectValue placeholder={t("fields.visibility.placeholder")} />
 </SelectTrigger>
 <SelectContent>
 {TRIP_VISIBILITY_OPTIONS.map((option) => (
 <SelectItem key={option} value={option}>
 {tVisibility(option)}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 />
 {!isCreate && (
 <Controller
 name="visibility"
 control={control}
 render={({ field }) => (
 <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
 {t(`visibility.${field.value}.hint`)}
 </p>
 )}
 />
 )}
 </FormField>

 <FormField
 label={t("fields.status.label")}
 htmlFor="status"
 error={errors.status?.message}
 >
 <Controller
 name="status"
 control={control}
 render={({ field }) => (
 <Select value={field.value} onValueChange={field.onChange}>
 <SelectTrigger
 id="status"
 className="h-11 w-full rounded-xl sm:h-10"
 aria-invalid={!!errors.status}
 >
 <SelectValue placeholder={t("fields.status.placeholder")} />
 </SelectTrigger>
 <SelectContent>
 {TRIP_STATUS_OPTIONS.map((option) => (
 <SelectItem key={option} value={option}>
 {tStatus(option)}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 />
 {!isCreate && (
 <Controller
 name="status"
 control={control}
 render={({ field }) => (
 <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
 {t(`status.${field.value}.hint`)}
 </p>
 )}
 />
 )}
 </FormField>
 </div>
 </FormSection>

 {(isCreate || inventory.length > 0) && (
 <FormSection
 icon={Backpack}
 eyebrow={t("sections.equipment.eyebrow")}
 title={t("sections.equipment.title")}
 description={t("sections.equipment.description")}
 >
 {inventory.length > 0 ? (
 <EquipmentSelector
 inventory={inventory}
 categories={equipmentCategories}
 selectedIds={selectedEquipmentIds}
 onChange={setSelectedEquipmentIds}
 />
 ) : (
 <p className="text-sm text-muted-foreground">
 {t("sections.equipment.emptyInventory")}{" "}
 <Link
 href={dashboardRoutes.newEquipment()}
 className="font-medium text-primary underline-offset-4 hover:underline"
 >
 {t("sections.equipment.addToInventory")}
 </Link>
 </p>
 )}
 </FormSection>
 )}

 {!hideActions && (
 <JournalCard
 padding="lg"
 className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
 >
 {!isCreate && (
 <div className="flex items-start gap-3">
 <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
 <p className="text-sm leading-relaxed text-muted-foreground">
 {t("footer.edit")}
 </p>
 </div>
 )}

 <div
 className={cn(
 "flex flex-col-reverse gap-3 sm:flex-row sm:items-center",
 isCreate && "sm:ml-auto",
 )}
 >
 <Button
 type="button"
 variant="ghost"
 render={<Link href={cancelHref} />}
 >
 {t("actions.cancel")}
 </Button>
 <Button
 type="submit"
 variant="warm"
 size="lg"
 disabled={isSubmitting || submitted}
 className="sm:min-w-[180px]"
 >
 {submitted
 ? t("actions.saved")
 : isSubmitting
 ? mode === "create"
 ? t("actions.creating")
 : t("actions.saving")
 : mode === "create"
 ? t("actions.create")
 : t("actions.save")}
 </Button>
 </div>
 </JournalCard>
 )}

 {submitted && (
 <p
 className="text-center text-sm text-foreground"
 role="status"
 >
 {mode === "create" ? t("success.create") : t("success.edit")}
 </p>
 )}
 </form>
 );
}
