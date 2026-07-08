"use client";

import type { DesignConcept } from "@/lib/design-system/concepts/types";
import { cn } from "@/lib/utils";

interface DesignConceptPreviewCardProps {
  concept: DesignConcept;
  className?: string;
}

/** Editorial magazine mockup — photo-first, not SaaS dashboard. */
export function DesignConceptPreviewCard({
  concept,
  className,
}: DesignConceptPreviewCardProps) {
  const isDark = concept.mode === "dark";

  return (
    <article
      data-design-concept={concept.id}
      className={cn(
        "concept-preview-root overflow-hidden rounded-2xl border border-border",
        className,
      )}
    >
      <header className="border-b px-4 py-3" style={{ borderColor: "var(--concept-border)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="concept-preview-heading text-base font-semibold">{concept.name}</h3>
            <p className="concept-preview-muted mt-1 text-xs leading-relaxed">{concept.personality}</p>
          </div>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{
              background: "var(--concept-surface-muted)",
              color: "var(--concept-muted-foreground)",
            }}
          >
            {concept.mode}
          </span>
        </div>
      </header>

      {/* Hero — editorial cover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `linear-gradient(160deg, ${concept.colors.surfaceMuted} 0%, ${concept.colors.background} 40%, ${concept.colors.secondary}33 100%)`
              : `linear-gradient(145deg, ${concept.colors.surfaceMuted} 0%, ${concept.colors.secondary}55 50%, ${concept.colors.accent}44 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {isDark && (
          <div
            className="absolute inset-x-0 top-0 h-[12%]"
            style={{ background: "var(--concept-background)" }}
          />
        )}
        {isDark && (
          <div
            className="absolute inset-x-0 bottom-0 h-[12%]"
            style={{ background: "var(--concept-background)" }}
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <p
            className="text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--concept-muted-foreground)" }}
          >
            Issue · Summer 2025
          </p>
          <h4
            className="concept-preview-heading mt-1 text-xl font-semibold leading-tight"
            style={{ color: "var(--concept-foreground)" }}
          >
            Iceland
          </h4>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--concept-muted-foreground)" }}
          >
            12 days · Ring Road
          </p>
        </div>
      </div>

      {/* Photo grid + story */}
      <div className="grid grid-cols-3 gap-1 p-3">
        {[concept.colors.primary, concept.colors.secondary, concept.colors.accent].map(
          (color, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-sm"
              style={{
                background: `linear-gradient(180deg, ${color}88 0%, ${concept.colors.surfaceMuted} 100%)`,
                borderRadius: "var(--concept-radius-sm)",
              }}
            />
          ),
        )}
      </div>

      <div className="px-4 pb-3">
        <p
          className="concept-preview-heading text-sm font-medium leading-snug"
          style={{ color: "var(--concept-foreground)" }}
        >
          Day 4 — Skógafoss
        </p>
        <p
          className="concept-preview-muted mt-1 text-xs leading-relaxed"
          style={{ color: "var(--concept-muted-foreground)" }}
        >
          Mist on the falls, late afternoon light through the gorge.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="concept-preview-btn-primary px-3 py-1.5 text-[11px] font-medium"
          >
            Read chapter
          </button>
          <button
            type="button"
            className="concept-preview-btn-secondary px-3 py-1.5 text-[11px] font-medium"
          >
            Gallery
          </button>
        </div>
      </div>

      {/* Palette */}
      <footer className="grid grid-cols-5 gap-1 border-t px-4 py-3" style={{ borderColor: "var(--concept-border)" }}>
        {(
          [
            ["primary", concept.colors.primary],
            ["secondary", concept.colors.secondary],
            ["accent", concept.colors.accent],
            ["surface", concept.colors.surface],
            ["background", concept.colors.background],
          ] as const
        ).map(([label, color]) => (
          <div key={label} className="text-center">
            <div
              className="mx-auto h-5 w-full border"
              style={{ background: color, borderColor: "var(--concept-border)", borderRadius: "var(--concept-radius-sm)" }}
              title={label}
            />
            <span className="concept-preview-muted mt-0.5 block text-[8px] uppercase">{label}</span>
          </div>
        ))}
      </footer>
    </article>
  );
}
