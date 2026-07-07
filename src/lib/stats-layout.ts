/** Single-row stat layout — items share width equally, never wrap. */
export const STAT_ROW_CLASS =
  "flex w-full flex-nowrap items-stretch gap-1.5 sm:gap-2 md:gap-3";

/** Equal-width column in a stat row. */
export const STAT_ITEM_CLASS = "min-w-0 flex-1 basis-0";

/** Compact stat pill used on trip and profile pages. */
export const STAT_CARD_CLASS =
  "flex h-full w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border bg-card px-1 py-2 text-center shadow-sm sm:gap-1 sm:rounded-xl sm:px-1.5 sm:py-2.5";

/** Dashboard home stat cards — same flexible column width. */
export const STAT_DASHBOARD_ITEM_CLASS = STAT_ITEM_CLASS;
