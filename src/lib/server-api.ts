import { getApiBaseUrl } from "@/api/config";
import type { ApiItemResponse } from "@/api/types";

export async function serverApiGet<T>(path: string): Promise<T | null> {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${base}${normalizedPath}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const body = (await response.json()) as ApiItemResponse<T>;
  return body.data;
}
