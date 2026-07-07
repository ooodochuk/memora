import type { AppLocale } from "@/constants";

export function formatDate(
 date: string,
 locale: AppLocale,
 options: Intl.DateTimeFormatOptions = {
 month: "long",
 day: "numeric",
 year: "numeric",
 },
): string {
 return new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", options).format(
 new Date(date),
 );
}

export function formatDayHeaderDate(date: string, locale: AppLocale): string {
 return formatDate(date, locale, { day: "numeric", month: "long" });
}

export function formatDateRange(
 start: string,
 end: string | undefined,
 locale: AppLocale,
): string {
 const formatter = new Intl.DateTimeFormat(
 locale === "uk" ? "uk-UA" : "en-US",
 {
 month: "short",
 day: "numeric",
 year: "numeric",
 },
 );
 if (!end) return formatter.format(new Date(start));
 return `${formatter.format(new Date(start))} — ${formatter.format(new Date(end))}`;
}

export function formatTime(time: string, locale: AppLocale): string {
 const [hours, minutes] = time.split(":").map(Number);
 const date = new Date();
 date.setHours(hours, minutes, 0, 0);
 return new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", {
 hour: "numeric",
 minute: "2-digit",
 }).format(date);
}

export function getTripDuration(start: string, end?: string): number {
 if (!end) return 1;
 const startDate = new Date(start);
 const endDate = new Date(end);
 const diff = endDate.getTime() - startDate.getTime();
 return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}
