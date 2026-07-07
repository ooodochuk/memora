"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { Place } from "@/types";
import {
 PLACE_CATEGORY_OPTIONS,
 createPlaceFormSchema,
 emptyPlaceFormValues,
 formValuesToPlace,
 type PlaceFormValues,
} from "@/lib/validations/place-form";
import { FormField } from "@/components/design-system/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

interface PlaceCreateFormProps {
 tripId: string;
 defaultName?: string;
 defaultCountry?: string;
 defaultRegion?: string;
 onSave: (place: Place) => void;
 onCancel: () => void;
}

export function PlaceCreateForm({
 tripId,
 defaultName = "",
 defaultCountry = "",
 defaultRegion = "",
 onSave,
 onCancel,
}: PlaceCreateFormProps) {
 const t = useTranslations("dashboard.placeForm");
 const tCategories = useTranslations("place.categories");

 const schema = useMemo(
 () =>
 createPlaceFormSchema({
 nameRequired: t("errors.nameRequired"),
 nameMin: t("errors.nameMin"),
 nameMax: t("errors.nameMax"),
 categoryRequired: t("errors.categoryRequired"),
 countryRequired: t("errors.countryRequired"),
 regionRequired: t("errors.regionRequired"),
 addressMax: t("errors.addressMax"),
 latInvalid: t("errors.latInvalid"),
 lngInvalid: t("errors.lngInvalid"),
 }),
 [t],
 );

 const {
 register,
 handleSubmit,
 control,
 formState: { errors, isSubmitting },
 } = useForm<PlaceFormValues>({
 resolver: zodResolver(schema),
 defaultValues: emptyPlaceFormValues({
 name: defaultName,
 country: defaultCountry,
 region: defaultRegion,
 }),
 });

 return (
 <form
 onSubmit={handleSubmit((values) => onSave(formValuesToPlace(values, tripId)))}
 className="space-y-4 rounded-xl border border-border bg-card p-4"
 >
 <p className="font-heading text-sm font-medium">{t("inlineTitle")}</p>

 <FormField
 label={t("fields.name.label")}
 htmlFor="place-name"
 error={errors.name?.message}
 >
 <Input id="place-name" {...register("name")} aria-invalid={!!errors.name} />
 </FormField>

 <FormField
 label={t("fields.category.label")}
 htmlFor="place-category"
 error={errors.category?.message}
 >
 <Controller
 name="category"
 control={control}
 render={({ field }) => (
 <Select value={field.value} onValueChange={field.onChange}>
 <SelectTrigger id="place-category" className="w-full">
 <SelectValue placeholder={t("fields.category.placeholder")} />
 </SelectTrigger>
 <SelectContent>
 {PLACE_CATEGORY_OPTIONS.map((category) => (
 <SelectItem key={category} value={category}>
 {tCategories(category)}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 />
 </FormField>

 <div className="grid gap-4 sm:grid-cols-2">
 <FormField
 label={t("fields.country.label")}
 htmlFor="place-country"
 error={errors.country?.message}
 >
 <Input id="place-country" {...register("country")} />
 </FormField>
 <FormField
 label={t("fields.region.label")}
 htmlFor="place-region"
 error={errors.region?.message}
 >
 <Input id="place-region" {...register("region")} />
 </FormField>
 </div>

 <FormField
 label={t("fields.address.label")}
 htmlFor="place-address"
 hint={t("fields.address.hint")}
 error={errors.address?.message}
 >
 <Input id="place-address" {...register("address")} />
 </FormField>

 <div className="grid gap-4 sm:grid-cols-2">
 <FormField
 label={t("fields.lat.label")}
 htmlFor="place-lat"
 hint={t("fields.lat.hint")}
 error={errors.lat?.message}
 >
 <Input id="place-lat" inputMode="decimal" {...register("lat")} />
 </FormField>
 <FormField
 label={t("fields.lng.label")}
 htmlFor="place-lng"
 hint={t("fields.lng.hint")}
 error={errors.lng?.message}
 >
 <Input id="place-lng" inputMode="decimal" {...register("lng")} />
 </FormField>
 </div>

 <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
 <Button type="button" variant="outline" size="sm" onClick={onCancel}>
 {t("actions.cancel")}
 </Button>
 <Button type="submit" variant="warm" size="sm" disabled={isSubmitting}>
 {t("actions.create")}
 </Button>
 </div>
 </form>
 );
}
