import type { DesignConcept } from "./types";

/** CSS custom property names scoped under `[data-design-concept]` for preview/comparison. */
export const conceptCssVarNames = {
  primary: "--concept-primary",
  secondary: "--concept-secondary",
  accent: "--concept-accent",
  background: "--concept-background",
  surface: "--concept-surface",
  surfaceMuted: "--concept-surface-muted",
  foreground: "--concept-foreground",
  mutedForeground: "--concept-muted-foreground",
  border: "--concept-border",
  success: "--concept-success",
  warning: "--concept-warning",
  error: "--concept-error",
  info: "--concept-info",
  radiusSm: "--concept-radius-sm",
  radiusMd: "--concept-radius-md",
  radiusLg: "--concept-radius-lg",
  radiusPill: "--concept-radius-pill",
  shadowSm: "--concept-shadow-sm",
  shadowMd: "--concept-shadow-md",
  shadowLg: "--concept-shadow-lg",
  fontHeading: "--concept-font-heading",
  fontBody: "--concept-font-body",
  motionDuration: "--concept-motion-duration",
  motionEasing: "--concept-motion-easing",
} as const;

export function conceptToCssProperties(concept: DesignConcept): Record<string, string> {
  const { colors, radius, shadows, status, typography, motion } = concept;
  return {
    [conceptCssVarNames.primary]: colors.primary,
    [conceptCssVarNames.secondary]: colors.secondary,
    [conceptCssVarNames.accent]: colors.accent,
    [conceptCssVarNames.background]: colors.background,
    [conceptCssVarNames.surface]: colors.surface,
    [conceptCssVarNames.surfaceMuted]: colors.surfaceMuted,
    [conceptCssVarNames.foreground]: colors.foreground,
    [conceptCssVarNames.mutedForeground]: colors.mutedForeground,
    [conceptCssVarNames.border]: colors.border,
    [conceptCssVarNames.success]: status.success,
    [conceptCssVarNames.warning]: status.warning,
    [conceptCssVarNames.error]: status.error,
    [conceptCssVarNames.info]: status.info,
    [conceptCssVarNames.radiusSm]: radius.sm,
    [conceptCssVarNames.radiusMd]: radius.md,
    [conceptCssVarNames.radiusLg]: radius.lg,
    [conceptCssVarNames.radiusPill]: radius.pill,
    [conceptCssVarNames.shadowSm]: shadows.sm,
    [conceptCssVarNames.shadowMd]: shadows.md,
    [conceptCssVarNames.shadowLg]: shadows.lg,
    [conceptCssVarNames.fontHeading]: typography.heading,
    [conceptCssVarNames.fontBody]: typography.body,
    [conceptCssVarNames.motionDuration]: motion.duration,
    [conceptCssVarNames.motionEasing]: motion.easing,
  };
}

export function conceptToCssBlock(concept: DesignConcept): string {
  const props = conceptToCssProperties(concept);
  const lines = Object.entries(props).map(([key, value]) => `  ${key}: ${value};`);
  return `[data-design-concept="${concept.id}"] {\n${lines.join("\n")}\n}`;
}

export function allConceptsToCss(concepts: DesignConcept[]): string {
  return concepts.map(conceptToCssBlock).join("\n\n");
}

export function conceptToInlineStyle(
  concept: DesignConcept,
): Record<string, string> {
  return conceptToCssProperties(concept);
}
