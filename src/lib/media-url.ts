import { getApiBaseUrl } from "@/api/config";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function getConfiguredMediaBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
  return raw ? normalizeBaseUrl(raw) : null;
}

/** Whether the URL points at media served by Memora (backend files API or object storage CDN). */
export function isMemoraUploadedUrl(url: string): boolean {
  if (!url) return false;

  const mediaBase = getConfiguredMediaBaseUrl();
  if (mediaBase && url.startsWith(`${mediaBase}/`)) {
    return true;
  }

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
