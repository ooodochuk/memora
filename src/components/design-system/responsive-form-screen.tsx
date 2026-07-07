"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResponsiveFormScreenProps {
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
  /** Wider forms (e.g. adventure create/edit, events). Default is compact. */
  size?: "default" | "wide";
}

function FormHeader({
  title,
  backLabel,
  onBack,
}: {
  title: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-10 gap-1 px-2"
        onClick={onBack}
      >
        <ChevronLeft className="size-5" />
        <span className="sr-only sm:not-sr-only">{backLabel}</span>
      </Button>
      <h1 className="min-w-0 flex-1 truncate font-heading text-lg font-medium tracking-tight sm:text-xl">
        {title}
      </h1>
    </header>
  );
}

function FormFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="shrink-0 border-t border-border px-4 py-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {children}
      </div>
    </footer>
  );
}

const SIZE_CLASS = {
  default: "max-w-3xl",
  wide: "max-w-3xl",
} as const;

export function ResponsiveFormScreen({
  title,
  backHref,
  backLabel,
  children,
  footer,
  className,
  size = "default",
}: ResponsiveFormScreenProps) {
  const router = useRouter();

  function handleBack() {
    router.push(backHref);
  }

  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8",
        SIZE_CLASS[size],
        className,
      )}
    >
      <div className="flex flex-col rounded-2xl border border-border bg-card shadow-sm">
        <FormHeader title={title} backLabel={backLabel} onBack={handleBack} />
        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</div>
        <FormFooter>{footer}</FormFooter>
      </div>
    </div>
  );
}
