"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { containerSizes, pagePadding } from "@/lib/design-system/tokens";
import { cn } from "@/lib/utils";

interface ResponsiveFormScreenProps {
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
  /** Wider forms (e.g. adventure create/edit, moments). */
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
    <header className="flex shrink-0 items-center gap-3 border-b border-border pb-4">
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
      <h1 className="min-w-0 flex-1 truncate font-heading text-lg font-medium tracking-tight sm:text-xl lg:text-2xl">
        {title}
      </h1>
    </header>
  );
}

function FormFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="sticky bottom-0 z-10 shrink-0 border-t border-border bg-background/95 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
      <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {children}
      </div>
    </footer>
  );
}

const SIZE_CLASS = {
  default: containerSizes.form,
  wide: containerSizes.formWide,
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
        "mx-auto flex w-full min-h-[calc(100dvh-4rem)] flex-col overflow-x-hidden",
        pagePadding,
        "py-4 sm:py-6 lg:py-8",
        SIZE_CLASS[size],
        className,
      )}
    >
      <FormHeader title={title} backLabel={backLabel} onBack={handleBack} />
      <div className="flex-1 py-5 sm:py-6 lg:py-8">{children}</div>
      <FormFooter>{footer}</FormFooter>
    </div>
  );
}
