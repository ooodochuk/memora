"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

interface ToastState {
  message: string;
  variant: ToastVariant;
}

interface AppToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const AppToastContext = createContext<AppToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToast({ message, variant });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AppToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-none fixed bottom-24 left-1/2 z-[100] w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border px-4 py-3 text-center text-sm font-medium shadow-lg backdrop-blur-sm lg:bottom-8",
            toast.variant === "success"
              ? "border-border bg-card/95 text-foreground"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          )}
        >
          {toast.message}
        </div>
      )}
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(AppToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within AppToastProvider");
  }
  return context;
}
