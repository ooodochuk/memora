import { cn } from "@/lib/utils";

export const FORM_FIELD_MIN_WIDTH = "180px";

/** Responsive grid: stacked on mobile, auto-wrapping columns from md up. */
export const formFieldsGridClassName =
  "grid grid-cols-1 gap-4 md:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]";

export const formControlClassName = "h-11 w-full min-w-0 sm:h-10";

export const formDateControlClassName = cn(
  formControlClassName,
  "appearance-none [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70",
);

export const formTimeControlClassName = formControlClassName;

export const formFieldClassName = "min-w-0";

export const formLabelClassName = "whitespace-nowrap";
