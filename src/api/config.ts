/**
 * Runtime API configuration from environment variables.
 * Defaults keep local development on mock data.
 */
export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    return "http://localhost:8080/api";
  }

  let normalized = url.replace(/\/$/, "");
  // Without a protocol, fetch() treats the URL as relative to the current page
  // (e.g. /uk/memora-backend... on Vercel instead of the Railway host).
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized.replace(/^\/+/, "")}`;
  }

  return normalized;
}

/** When true, feature API modules serve data from local mock accessors. */
export function isMockMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_USE_MOCKS?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;
  // Safe default until backend is ready.
  return true;
}

/** Optional artificial delay in mock mode (ms) — useful for testing loading UI. */
export function getMockDelayMs(): number {
  const raw = process.env.NEXT_PUBLIC_MOCK_DELAY_MS;
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
