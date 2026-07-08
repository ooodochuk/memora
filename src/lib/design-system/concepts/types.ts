export type DesignConceptMode = "light" | "dark";

export interface DesignConceptPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  foreground: string;
  mutedForeground: string;
  border: string;
}

export interface DesignConceptTypography {
  heading: string;
  body: string;
  h1: string;
  h2: string;
  h3: string;
  bodySize: string;
  labelSize: string;
}

export interface DesignConceptRadius {
  sm: string;
  md: string;
  lg: string;
  pill: string;
}

export interface DesignConceptShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface DesignConceptStatus {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface DesignConceptMotion {
  duration: string;
  easing: string;
  style: string;
}

/** Full token set for a visual redesign direction (comparison only — not wired to runtime theme yet). */
export interface DesignConcept {
  id: string;
  name: string;
  mode: DesignConceptMode;
  personality: string;
  colors: DesignConceptPalette;
  typography: DesignConceptTypography;
  radius: DesignConceptRadius;
  shadows: DesignConceptShadows;
  buttons: {
    primary: string;
    secondary: string;
    ghost: string;
  };
  forms: string;
  cards: string;
  tables: string;
  navigation: string;
  icons: string;
  status: DesignConceptStatus;
  charts: string;
  spacing: number[];
  motion: DesignConceptMotion;
}
