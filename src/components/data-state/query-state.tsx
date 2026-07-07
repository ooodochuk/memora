"use client";

import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/api/errors";
import { EmptyState } from "@/components/design-system/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QueryLoadingProps {
  label?: string;
  className?: string;
}

export function QueryLoading({ label, className }: QueryLoadingProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-16 text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label ?? t("loading")}</span>
    </div>
  );
}

interface QueryErrorProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export function QueryError({ error, onRetry, className }: QueryErrorProps) {
  const t = useTranslations("common");

  return (
    <EmptyState
      className={className}
      icon={AlertCircle}
      title={t("loadError")}
      description={getErrorMessage(error)}
      action={
        onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            {t("retry")}
          </Button>
        ) : undefined
      }
      size="md"
    />
  );
}

interface QueryStateProps<T> {
  query: UseQueryResult<T, Error>;
  loading?: ReactNode;
  error?: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}

export function QueryState<T>({
  query,
  loading,
  error,
  empty,
  isEmpty,
  children,
}: QueryStateProps<T>) {
  if (query.isLoading) {
    return <>{loading ?? <QueryLoading />}</>;
  }

  if (query.isError) {
    return (
      <>
        {error ?? (
          <QueryError error={query.error} onRetry={() => query.refetch()} />
        )}
      </>
    );
  }

  if (query.data === undefined) {
    return null;
  }

  if (isEmpty?.(query.data)) {
    return empty ? <>{empty}</> : null;
  }

  return <>{children(query.data)}</>;
}
