"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/auth-provider";
import { dashboardRoutes } from "@/constants/routes";

export function GuestAuthRedirect({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(dashboardRoutes.home());
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || isAuthenticated) {
    return null;
  }

  return children;
}
