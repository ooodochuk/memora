"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyAuthSession,
  getClientAuthSnapshot,
  getServerAuthSnapshot,
  subscribeAuthSession,
} from "@/lib/auth-session";

interface AuthContextValue {
  isReady: boolean;
  isAuthenticated: boolean;
  setAuthSession: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useSyncExternalStore(
    subscribeAuthSession,
    getClientAuthSnapshot,
    getServerAuthSnapshot,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady: authState.isReady,
      isAuthenticated: Boolean(authState.token),
      setAuthSession: applyAuthSession,
    }),
    [authState.isReady, authState.token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
