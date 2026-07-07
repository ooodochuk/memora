import type { CloudLinkProvider } from "@/types";
import {
 Box,
 Cloud,
 HardDrive,
 Link2,
 type LucideIcon,
} from "lucide-react";

export const CLOUD_LINK_PROVIDER_OPTIONS = [
 "GOOGLE_DRIVE",
 "ICLOUD",
 "DROPBOX",
 "ONEDRIVE",
 "OTHER",
] as const satisfies readonly CloudLinkProvider[];

export const cloudProviderIcons: Record<CloudLinkProvider, LucideIcon> = {
 GOOGLE_DRIVE: Cloud,
 ICLOUD: Cloud,
 DROPBOX: Box,
 ONEDRIVE: HardDrive,
 OTHER: Link2,
};

export const cloudProviderStyles: Record<
 CloudLinkProvider,
 { bg: string; fg: string; border: string }
> = {
 GOOGLE_DRIVE: {
 bg: "color-mix(in oklab, #4285f4 14%, var(--card))",
 fg: "color-mix(in oklab, #4285f4 72%, var(--foreground))",
 border: "color-mix(in oklab, #4285f4 20%, var(--border-border))",
 },
 ICLOUD: {
 bg: "color-mix(in oklab, #007aff 14%, var(--card))",
 fg: "color-mix(in oklab, #007aff 72%, var(--foreground))",
 border: "color-mix(in oklab, #007aff 20%, var(--border-border))",
 },
 DROPBOX: {
 bg: "color-mix(in oklab, #0061ff 14%, var(--card))",
 fg: "color-mix(in oklab, #0061ff 72%, var(--foreground))",
 border: "color-mix(in oklab, #0061ff 20%, var(--border-border))",
 },
 ONEDRIVE: {
 bg: "color-mix(in oklab, #0078d4 14%, var(--card))",
 fg: "color-mix(in oklab, #0078d4 72%, var(--foreground))",
 border: "color-mix(in oklab, #0078d4 20%, var(--border-border))",
 },
 OTHER: {
 bg: "var(--surface)",
 fg: "var(--muted-foreground)",
 border: "var(--border-border)",
 },
};

export function formatCloudLinkHost(url: string): string {
 try {
 return new URL(url).hostname.replace(/^www\./, "");
 } catch {
 return url;
 }
}
