"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
 CLOUD_LINK_PROVIDER_OPTIONS,
 cloudProviderIcons,
 cloudProviderStyles,
} from "@/lib/cloud-providers";
import {
 createCloudLinkFormSchema,
 emptyCloudLinkFormValues,
 type CloudLinkFormValues,
} from "@/lib/validations/cloud-link-form";
import { FormField } from "@/components/design-system/form-field";
import { formControlClassName } from "@/lib/design-system/form-layout";
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

interface CloudLinkFormProps {
 defaultValues?: CloudLinkFormValues;
 onSubmit: (values: CloudLinkFormValues) => void;
 onCancel: () => void;
 submitLabel: string;
}

export function CloudLinkForm({
 defaultValues,
 onSubmit,
 onCancel,
 submitLabel,
}: CloudLinkFormProps) {
 const t = useTranslations("cloudLink.form");
 const tProviders = useTranslations("cloudLink.providers");

 const schema = useMemo(
 () =>
 createCloudLinkFormSchema({
 providerRequired: t("errors.providerRequired"),
 urlRequired: t("errors.urlRequired"),
 urlInvalid: t("errors.urlInvalid"),
 titleRequired: t("errors.titleRequired"),
 titleMin: t("errors.titleMin"),
 titleMax: t("errors.titleMax"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 watch,
 formState: { errors, isSubmitting },
 } = useForm<CloudLinkFormValues>({
 resolver: zodResolver(schema),
 defaultValues: defaultValues ?? emptyCloudLinkFormValues,
 });

 const selectedProvider = watch("provider");
 const providerColors = cloudProviderStyles[selectedProvider];
 const ProviderIcon = cloudProviderIcons[selectedProvider];

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 <FormField
 label={t("fields.provider.label")}
 htmlFor="provider"
 hint={t("fields.provider.hint")}
 error={errors.provider?.message}
 >
 <Controller
 name="provider"
 control={control}
 render={({ field }) => (
 <Select value={field.value} onValueChange={field.onChange}>
 <SelectTrigger
 id="provider"
 className={cn(formControlClassName, "rounded-xl")}
 aria-invalid={!!errors.provider}
 >
 <SelectValue placeholder={t("fields.provider.placeholder")} />
 </SelectTrigger>
 <SelectContent>
 {CLOUD_LINK_PROVIDER_OPTIONS.map((provider) => {
 const Icon = cloudProviderIcons[provider];
 return (
 <SelectItem key={provider} value={provider}>
 <span className="inline-flex items-center gap-2">
 <Icon className="size-3.5" aria-hidden />
 {tProviders(provider)}
 </span>
 </SelectItem>
 );
 })}
 </SelectContent>
 </Select>
 )}
 />
 </FormField>

 <div
 className={cn(
 "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
 )}
 style={{
 backgroundColor: providerColors.bg,
 borderColor: providerColors.border,
 color: providerColors.fg,
 }}
 >
 <ProviderIcon className="size-4 shrink-0" strokeWidth={1.75} />
 <p className="leading-relaxed opacity-90">{t("providerNote")}</p>
 </div>

 <FormField
 label={t("fields.url.label")}
 htmlFor="url"
 hint={t("fields.url.hint")}
 error={errors.url?.message}
 >
 <Input
 id="url"
 type="url"
 className={formControlClassName}
 placeholder={t("fields.url.placeholder")}
 aria-invalid={!!errors.url}
 {...register("url")}
 />
 </FormField>

 <FormField
 label={t("fields.title.label")}
 htmlFor="cloud-link-title"
 hint={t("fields.title.hint")}
 error={errors.title?.message}
 >
 <Input
 id="cloud-link-title"
 className={formControlClassName}
 placeholder={t("fields.title.placeholder")}
 aria-invalid={!!errors.title}
 {...register("title")}
 />
 </FormField>

 <FormField
 label={t("fields.description.label")}
 htmlFor="cloud-link-description"
 hint={t("fields.description.hint")}
 error={errors.description?.message}
 >
 <Textarea
 id="cloud-link-description"
 rows={3}
 placeholder={t("fields.description.placeholder")}
 aria-invalid={!!errors.description}
 {...register("description")}
 />
 </FormField>

 <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
 <Button type="button" variant="ghost" onClick={onCancel}>
 {t("cancel")}
 </Button>
 <Button type="submit" variant="warm" disabled={isSubmitting}>
 {submitLabel}
 </Button>
 </div>
 </form>
 );
}
