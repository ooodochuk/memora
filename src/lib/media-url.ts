import { getApiBaseUrl } from "@/api/config";

/** Whether the URL points at media served by our backend upload API. */
export function isMemoraUploadedUrl(url: string): boolean {
  if (!url) return false;
  try {
    const base = new URL(getApiBaseUrl());
    const target = new URL(url);
    return (
      target.hostname === base.hostname &&
      target.pathname.includes("/media/files/")
    );
  } catch {
    return url.includes("/media/files/");
  }
}

/** Gradient placeholder when no cover image is set. */
export const COVER_PLACEHOLDER_CLASS =
  "bg-gradient-to-br from-primary/25 via-muted to-background";
