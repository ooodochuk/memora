import { getMockDelayMs } from "@/api/config";

/** Simulates network latency when running in mock mode. */
export async function mockDelay(): Promise<void> {
  const ms = getMockDelayMs();
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}
