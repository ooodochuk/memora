export function buildFormDraftKey(
  scope: string,
  userId: string,
  locale: string,
): string {
  return `memora:draft:${scope}:${userId}:${locale}`;
}

export function readFormDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeFormDraft<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore quota or serialization errors.
  }
}

export function removeFormDraft(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
