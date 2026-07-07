import { z } from "zod";
import type { CloudLink } from "@/types";
import type { CloudLinkProvider } from "@/types";
import { CLOUD_LINK_PROVIDER_OPTIONS } from "@/lib/cloud-providers";

export interface CloudLinkFormMessages {
 providerRequired: string;
 urlRequired: string;
 urlInvalid: string;
 titleRequired: string;
 titleMin: string;
 titleMax: string;
}

export function createCloudLinkFormSchema(messages: CloudLinkFormMessages) {
 return z.object({
 provider: z.enum(CLOUD_LINK_PROVIDER_OPTIONS, {
 message: messages.providerRequired,
 }),
 url: z.string().min(1, messages.urlRequired).url(messages.urlInvalid),
 title: z
 .string()
 .min(1, messages.titleRequired)
 .min(2, messages.titleMin)
 .max(120, messages.titleMax),
 description: z.string().optional(),
 });
}

export type CloudLinkFormValues = z.infer<
 ReturnType<typeof createCloudLinkFormSchema>
>;

export const emptyCloudLinkFormValues: CloudLinkFormValues = {
 provider: "GOOGLE_DRIVE",
 url: "",
 title: "",
 description: "",
};

export function cloudLinkToFormValues(link: CloudLink): CloudLinkFormValues {
 return {
 provider: link.provider,
 url: link.url,
 title: link.title,
 description: link.description ?? "",
 };
}

export function formValuesToCloudLink(
 values: CloudLinkFormValues,
 options: {
 id: string;
 tripId: string;
 eventId?: string;
 },
): CloudLink {
 return {
 id: options.id,
 tripId: options.tripId,
 eventId: options.eventId,
 provider: values.provider,
 url: values.url,
 title: values.title,
 description: values.description || undefined,
 contentType: "other",
 };
}

export function createTempCloudLinkId(): string {
 return `cloud-temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
