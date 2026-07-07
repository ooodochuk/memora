"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { QueryLoading } from "@/components/data-state/query-state";
import { useAuth } from "@/providers/auth-provider";

interface DashboardAuthGuardProps {
  children: ReactNode;
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady) {
    return <QueryLoading className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
