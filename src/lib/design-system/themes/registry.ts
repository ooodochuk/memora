import { getDesignConceptById } from "@/lib/design-system/concepts";

/** Runtime theme id — applied as `class` on `<html>` via next-themes. */
export type AppThemeId =
  | "dark"
  | "light"
  | "kinfolk"
  | "conde-travel"
  | "darkroom"
  | "velvet-evening";

export type AppThemeMode = "light" | "dark";

export interface AppThemeDefinition {
  id: AppThemeId;
  /** i18n key under `theme.styles.*` */
  labelKey: string;
  mode: AppThemeMode;
  /** Editorial themes map to design concept ids for docs/preview parity */
  conceptId?: string;
  group: "default" | "editorial";
}

export const defaultAppThemes: AppThemeDefinition[] = [
  { id: "dark", labelKey: "quietJournalDark", mode: "dark", group: "default" },
  { id: "light", labelKey: "quietJournalLight", mode: "light", group: "default" },
];

export const editorialAppThemes: AppThemeDefinition[] = [
  {
    id: "kinfolk",
    labelKey: "kinfolk",
    mode: "light",
    conceptId: "kinfolk-light",
    group: "editorial",
  },
  {
    id: "conde-travel",
    labelKey: "condeTravel",
    mode: "light",
    conceptId: "conde-travel-light",
    group: "editorial",
  },
  {
    id: "darkroom",
    labelKey: "darkroom",
    mode: "dark",
    conceptId: "darkroom-dark",
    group: "editorial",
  },
  {
    id: "velvet-evening",
    labelKey: "velvetEvening",
    mode: "dark",
    conceptId: "velvet-evening-dark",
    group: "editorial",
  },
];

export const appThemes: AppThemeDefinition[] = [
  ...defaultAppThemes,
  ...editorialAppThemes,
];

export const appThemeIds: AppThemeId[] = appThemes.map((t) => t.id);

export const lightAppThemeIds: AppThemeId[] = appThemes
  .filter((t) => t.mode === "light")
  .map((t) => t.id);

export const darkAppThemeIds: AppThemeId[] = appThemes
  .filter((t) => t.mode === "dark")
  .map((t) => t.id);

export function getAppThemeById(id: string): AppThemeDefinition | undefined {
  return appThemes.find((t) => t.id === id);
}

export function getConceptForTheme(themeId: AppThemeId) {
  const theme = getAppThemeById(themeId);
  if (!theme?.conceptId) return undefined;
  return getDesignConceptById(theme.conceptId);
}
