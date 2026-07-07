"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { ProfileDto } from "@/features/auth/types";
import { useUpdateProfile } from "@/features/profile/hooks";
import {
  createProfileFormSchema,
  profileToFormValues,
  type ProfileFormValues,
} from "@/lib/validations/profile-form";
import { FormField } from "@/components/design-system/form-field";
import { JournalCard } from "@/components/design-system/journal-card";
import { Eyebrow } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Sparkles } from "lucide-react";

interface ProfileEditFormProps {
  profile: ProfileDto;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const t = useTranslations("dashboard.pages.profile");
  const updateProfile = useUpdateProfile();

  const schema = useMemo(
    () =>
      createProfileFormSchema({
        displayNameRequired: t("errors.displayNameRequired"),
        displayNameMax: t("errors.displayNameMax"),
        bioMax: t("errors.bioMax"),
        taglineMax: t("errors.taglineMax"),
        locationMax: t("errors.locationMax"),
        websiteInvalid: t("errors.websiteInvalid"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: profileToFormValues(profile),
  });

  async function onSubmit(values: ProfileFormValues) {
    const updated = await updateProfile.mutateAsync({
      displayName: values.displayName,
      bio: values.bio,
      tagline: values.tagline,
      location: values.location,
      website: values.website || undefined,
    });
    reset(profileToFormValues(updated));
  }

  return (
    <JournalCard padding="lg" className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary">
          <PenLine className="size-4" strokeWidth={1.75} />
        </div>
        <div className="space-y-1">
          <Eyebrow>{t("form.eyebrow")}</Eyebrow>
          <h2 className="font-heading text-xl font-medium tracking-tight">
            {t("form.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("form.description")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label={t("fields.displayName.label")}
          htmlFor="displayName"
          error={errors.displayName?.message}
        >
          <Input
            id="displayName"
            {...register("displayName")}
            aria-invalid={!!errors.displayName}
          />
        </FormField>

        <FormField
          label={t("fields.tagline.label")}
          htmlFor="tagline"
          hint={t("fields.tagline.hint")}
          error={errors.tagline?.message}
        >
          <Textarea id="tagline" rows={3} {...register("tagline")} />
        </FormField>

        <FormField
          label={t("fields.bio.label")}
          htmlFor="bio"
          hint={t("fields.bio.hint")}
          error={errors.bio?.message}
        >
          <Textarea id="bio" rows={4} {...register("bio")} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t("fields.location.label")}
            htmlFor="location"
            error={errors.location?.message}
          >
            <Input id="location" {...register("location")} />
          </FormField>

          <FormField
            label={t("fields.website.label")}
            htmlFor="website"
            hint={t("fields.website.hint")}
            error={errors.website?.message}
          >
            <Input
              id="website"
              type="url"
              placeholder="https://"
              {...register("website")}
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="warm"
            disabled={isSubmitting || !isDirty}
            className="gap-2"
          >
            <Sparkles className="size-4" />
            {isSubmitting ? t("actions.saving") : t("actions.save")}
          </Button>
        </div>
      </form>
    </JournalCard>
  );
}
