import { apiClient } from "@/api/client";
import { getStoredAuthToken, setStoredAuthToken } from "@/lib/auth-storage";

type AuthSnapshot = {
  isReady: boolean;
  token: string | null;
};

type AuthSessionListener = () => void;

let bootstrapped = false;
let currentToken: string | null = null;
let clientSnapshot: AuthSnapshot = { isReady: false, token: null };
const listeners = new Set<AuthSessionListener>();

const SERVER_SNAPSHOT: AuthSnapshot = { isReady: false, token: null };

export function getServerAuthSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

export function getClientAuthSnapshot(): AuthSnapshot {
  bootstrapAuthSession();
  const token = getAuthSessionToken();

  if (clientSnapshot.isReady && clientSnapshot.token === token) {
    return clientSnapshot;
  }

  clientSnapshot = { isReady: true, token };
  return clientSnapshot;
}

export function bootstrapAuthSession(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!bootstrapped) {
    currentToken = getStoredAuthToken();
    if (currentToken) {
      apiClient.setAuthToken(currentToken);
    }
    bootstrapped = true;
  }

  return currentToken;
}

export function getAuthSessionToken(): string | null {
  return currentToken;
}

export function applyAuthSession(token: string | null): void {
  currentToken = token;
  apiClient.setAuthToken(token);
  setStoredAuthToken(token);
  listeners.forEach((listener) => listener());
}

export function subscribeAuthSession(listener: AuthSessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
