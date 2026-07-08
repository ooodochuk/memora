"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { QueryLoading } from "@/components/data-state/query-state";
import { useAuth } from "@/providers/auth-provider";
import { dashboardRoutes } from "@/constants/routes";

interface GuestAuthRedirectProps {
  children: ReactNode;
  /** Min-height for auth check / redirect loading state */
  loadingClassName?: string;
}

export function GuestAuthRedirect({
  children,
  loadingClassName = "min-h-[50vh]",
}: GuestAuthRedirectProps) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(dashboardRoutes.home());
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || isAuthenticated) {
    return <QueryLoading className={loadingClassName} />;
  }

  return children;
}
