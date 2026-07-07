import { z } from "zod";

export interface ProfileFormMessages {
  displayNameRequired: string;
  displayNameMax: string;
  bioMax: string;
  taglineMax: string;
  locationMax: string;
  websiteInvalid: string;
}

export function createProfileFormSchema(messages: ProfileFormMessages) {
  return z.object({
    displayName: z
      .string()
      .min(1, messages.displayNameRequired)
      .max(120, messages.displayNameMax),
    bio: z.string().max(2000, messages.bioMax),
    tagline: z.string().max(500, messages.taglineMax),
    location: z.string().max(255, messages.locationMax),
    website: z
      .string()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: messages.websiteInvalid,
      }),
  });
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileFormSchema>
>;

export function profileToFormValues(profile: {
  displayName: string;
  bio: string;
  tagline?: string;
  location: string;
  website?: string | null;
}): ProfileFormValues {
  return {
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    tagline: profile.tagline ?? "",
    location: profile.location ?? "",
    website: profile.website ?? "",
  };
}
