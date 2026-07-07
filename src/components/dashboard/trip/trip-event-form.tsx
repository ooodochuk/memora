"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Clock3, Cloud, ListOrdered, MapPin, PenLine, Sparkles } from "lucide-react";
import type { CloudLink } from "@/types";
import { CloudLinkList } from "@/components/cloud-links";
import { dashboardRoutes } from "@/constants/routes";
import {
 createDefaultEventFormValues,
 createTripEventFormSchema,
 type TripEventFormValues,
} from "@/lib/validations/trip-event-form";
import { TRIP_VISIBILITY_OPTIONS } from "@/lib/validations/trip-form";
import { EventTypePicker } from "@/components/dashboard/trip/event-type-picker";
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
import type { LucideIcon } from "lucide-react";

export interface TripEventPlaceOption {
 id: string;
 name: string;
}

interface TripEventFormProps {
 mode: "create" | "edit";
 tripId: string;
 eventId?: string;
 places: TripEventPlaceOption[];
 defaultValues?: TripEventFormValues;
 initialCloudLinks?: CloudLink[];
}

interface FormSectionProps {
 eyebrow: string;
 title: string;
 description?: string;
 icon: LucideIcon;
 children: React.ReactNode;
}

function FormSection({
 eyebrow,
 title,
 description,
 icon: Icon,
 children,
}: FormSectionProps) {
 return (
 <JournalCard padding="lg">
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

export function TripEventForm({
 mode,
 tripId,
 eventId,
 places,
 defaultValues,
 initialCloudLinks = [],
}: TripEventFormProps) {
 const t = useTranslations("dashboard.tripEventForm");
 const tVisibility = useTranslations("designSystem.visibility");
 const router = useRouter();
 const [submitted, setSubmitted] = useState(false);
 const [cloudLinks, setCloudLinks] = useState(initialCloudLinks);

 const schema = useMemo(
 () =>
 createTripEventFormSchema({
 typeRequired: t("errors.typeRequired"),
 titleRequired: t("errors.titleRequired"),
 titleMin: t("errors.titleMin"),
 titleMax: t("errors.titleMax"),
 startTimeInvalid: t("errors.startTimeInvalid"),
 endTimeInvalid: t("errors.endTimeInvalid"),
 endTimeBeforeStart: t("errors.endTimeBeforeStart"),
 orderMin: t("errors.orderMin"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 formState: { errors, isSubmitting },
 } = useForm<TripEventFormValues>({
 resolver: zodResolver(schema),
 defaultValues: defaultValues ?? createDefaultEventFormValues({}),
 });

 async function onSubmit(_values: TripEventFormValues) {
 await new Promise((resolve) => setTimeout(resolve, 800));
 setSubmitted(true);

 window.setTimeout(() => {
 router.push(dashboardRoutes.trip(tripId));
 }, 1200);
 }

 const cancelHref = dashboardRoutes.trip(tripId);

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 <FormSection
 icon={PenLine}
 eyebrow={t("sections.type.eyebrow")}
 title={t("sections.type.title")}
 description={t("sections.type.description")}
 >
 <Controller
 name="type"
 control={control}
 render={({ field }) => (
 <EventTypePicker
 value={field.value}
 onChange={field.onChange}
 error={errors.type?.message}
 />
 )}
 />
 </FormSection>

 <FormSection
 icon={PenLine}
 eyebrow={t("sections.details.eyebrow")}
 title={t("sections.details.title")}
 description={t("sections.details.description")}
 >
 <div className="space-y-5">
 <FormField
 label={t("fields.title.label")}
 htmlFor="title"
 hint={t("fields.title.hint")}
 error={errors.title?.message}
 >
 <Input
 id="title"
 placeholder={t("fields.title.placeholder")}
 aria-invalid={!!errors.title}
 {...register("title")}
 />
 </FormField>

 <FormField
 label={t("fields.description.label")}
 htmlFor="description"
 hint={t("fields.description.hint")}
 error={errors.description?.message}
 >
 <Textarea
 id="description"
 rows={4}
 placeholder={t("fields.description.placeholder")}
 aria-invalid={!!errors.description}
 {...register("description")}
 />
 </FormField>
 </div>
 </FormSection>

 <div className="grid gap-6 lg:grid-cols-2">
 <FormSection
 icon={Clock3}
 eyebrow={t("sections.time.eyebrow")}
 title={t("sections.time.title")}
 description={t("sections.time.description")}
 >
 <div className="grid gap-5 sm:grid-cols-2">
 <FormField
 label={t("fields.startTime.label")}
 htmlFor="startTime"
 hint={t("fields.startTime.hint")}
 error={errors.startTime?.message}
 >
 <Input
 id="startTime"
 type="time"
 aria-invalid={!!errors.startTime}
 {...register("startTime")}
 />
 </FormField>

 <FormField
 label={t("fields.endTime.label")}
 htmlFor="endTime"
 hint={t("fields.endTime.hint")}
 error={errors.endTime?.message}
 >
 <Input
 id="endTime"
 type="time"
 aria-invalid={!!errors.endTime}
 {...register("endTime")}
 />
 </FormField>
 </div>
 </FormSection>

 <FormSection
 icon={MapPin}
 eyebrow={t("sections.place.eyebrow")}
 title={t("sections.place.title")}
 description={t("sections.place.description")}
 >
 <FormField
 label={t("fields.place.label")}
 htmlFor="placeId"
 hint={t("fields.place.hint")}
 error={errors.placeId?.message}
 >
 <Controller
 name="placeId"
 control={control}
 render={({ field }) => (
 <Select
 value={field.value || "none"}
 onValueChange={(value) =>
 field.onChange(value === "none" ? "" : value)
 }
 >
 <SelectTrigger
 id="placeId"
 className="h-11 w-full rounded-xl sm:h-10"
 >
 <SelectValue placeholder={t("fields.place.placeholder")} />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="none">
 {t("fields.place.none")}
 </SelectItem>
 {places.map((place) => (
 <SelectItem key={place.id} value={place.id}>
 {place.name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 />
 </FormField>
 </FormSection>
 </div>

 <div className="grid gap-6 lg:grid-cols-2">
 <FormSection
 icon={ListOrdered}
 eyebrow={t("sections.order.eyebrow")}
 title={t("sections.order.title")}
 description={t("sections.order.description")}
 >
 <FormField
 label={t("fields.order.label")}
 htmlFor="order"
 hint={t("fields.order.hint")}
 error={errors.order?.message}
 >
 <Input
 id="order"
 type="number"
 min={1}
 step={1}
 aria-invalid={!!errors.order}
 {...register("order", { valueAsNumber: true })}
 />
 </FormField>
 </FormSection>

 <FormSection
 icon={Sparkles}
 eyebrow={t("sections.visibility.eyebrow")}
 title={t("sections.visibility.title")}
 description={t("sections.visibility.description")}
 >
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
 <SelectValue
 placeholder={t("fields.visibility.placeholder")}
 />
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
 <Controller
 name="visibility"
 control={control}
 render={({ field }) => (
 <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
 {t(`visibility.${field.value}.hint`)}
 </p>
 )}
 />
 </FormField>
 </FormSection>
 </div>

 <JournalCard padding="lg">
 <div className="mb-6 flex items-start gap-4">
 <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary">
 <Cloud className="size-4" strokeWidth={1.75} />
 </div>
 <div className="space-y-1">
 <Eyebrow>{t("sections.cloudLinks.eyebrow")}</Eyebrow>
 <h2 className="font-heading text-xl font-medium tracking-tight sm:text-2xl">
 {t("sections.cloudLinks.title")}
 </h2>
 <p className="text-sm leading-relaxed text-muted-foreground">
 {t("sections.cloudLinks.description")}
 </p>
 </div>
 </div>

 <CloudLinkList
 links={cloudLinks}
 editable
 tripId={tripId}
 eventId={eventId}
 onChange={setCloudLinks}
 />
 </JournalCard>

 <JournalCard
 padding="lg"
 className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
 >
 <p className="text-sm leading-relaxed text-muted-foreground">
 {mode === "create"
 ? t("footer.createWithCloud")
 : t("footer.editWithCloud")}
 </p>

 <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
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
 className="sm:min-w-[160px]"
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

 {submitted && (
 <p
 className="text-center text-sm text-foreground"
 role="status"
 >
 {mode === "create" ? t("success.create") : t("success.edit")}
 </p>
 )}

 {mode === "edit" && eventId && (
 <input type="hidden" name="eventId" value={eventId} />
 )}
 </form>
 );
}
