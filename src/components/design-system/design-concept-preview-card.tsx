"use client";

import type { DesignConcept } from "@/lib/design-system/concepts/types";
import { cn } from "@/lib/utils";

interface DesignConceptPreviewCardProps {
  concept: DesignConcept;
  className?: string;
}

/** Mini homepage + dashboard mockup for a single design concept. */
export function DesignConceptPreviewCard({
  concept,
  className,
}: DesignConceptPreviewCardProps) {
  return (
    <article
      data-design-concept={concept.id}
      className={cn(
        "concept-preview-root overflow-hidden rounded-2xl border border-border",
        className,
      )}
    >
      <header className="border-b px-4 py-3" style={{ borderColor: "var(--concept-border)" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="concept-preview-heading text-base font-semibold">{concept.name}</h3>
            <p className="concept-preview-muted mt-0.5 text-xs">{concept.personality}</p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{
              background: "var(--concept-surface-muted)",
              color: "var(--concept-muted-foreground)",
            }}
          >
            {concept.mode}
          </span>
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {/* Homepage mock */}
        <section className="concept-preview-surface p-4">
          <p className="concept-preview-muted text-[10px] font-medium uppercase tracking-wider">
            Homepage
          </p>
          <h4 className="concept-preview-heading mt-2 text-lg font-semibold leading-tight">
            Where have you been?
          </h4>
          <p className="concept-preview-muted mt-1 text-xs leading-relaxed">
            Document adventures day by day — photos, moments, and memories.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="concept-preview-btn-primary px-3 py-1.5 text-xs font-medium">
              Start adventure
            </button>
            <button type="button" className="concept-preview-btn-secondary px-3 py-1.5 text-xs font-medium">
              Log in
            </button>
          </div>
        </section>

        {/* Dashboard mock */}
        <section className="concept-preview-surface p-4">
          <p className="concept-preview-muted text-[10px] font-medium uppercase tracking-wider">
            Dashboard
          </p>
          <div className="mt-2 flex gap-2">
            <div
              className="h-16 flex-1 rounded-md p-2"
              style={{ background: "var(--concept-surface-muted)" }}
            >
              <p className="text-[10px] font-medium">Iceland 2025</p>
              <p className="concept-preview-muted mt-0.5 text-[10px]">12 days · 48 moments</p>
            </div>
            <div
              className="h-16 flex-1 rounded-md p-2"
              style={{ background: "var(--concept-surface-muted)" }}
            >
              <p className="text-[10px] font-medium">Kyiv weekend</p>
              <p className="concept-preview-muted mt-0.5 text-[10px]">3 days · 9 moments</p>
            </div>
          </div>
          <input
            readOnly
            className="concept-preview-input mt-2 w-full px-2 py-1.5 text-xs"
            placeholder="Search adventures…"
            aria-hidden
          />
          <div className="mt-2 flex gap-3 text-[10px]">
            <span className="concept-preview-status-success">Published</span>
            <span className="concept-preview-status-warning">Draft</span>
            <span className="concept-preview-status-error">Archived</span>
          </div>
        </section>
      </div>

      {/* Token swatches */}
      <footer
        className="grid grid-cols-5 gap-1 px-4 pb-4"
        aria-label="Color palette"
      >
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
              className="mx-auto h-6 w-full rounded-md border"
              style={{ background: color, borderColor: "var(--concept-border)" }}
              title={label}
            />
            <span className="concept-preview-muted mt-0.5 block text-[9px]">{label}</span>
          </div>
        ))}
      </footer>
    </article>
  );
}
