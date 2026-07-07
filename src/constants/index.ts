/** Supported app locales — source of truth for i18n routing */
export const LOCALES = ["en", "uk"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const APP_NAME = "Memora";

export const APP_TAGLINE_KEY = "common.tagline";

/** Demo / seed data defaults */
export const DEFAULT_PROFILE_USERNAME = "oksana";

export const FEATURED_TRIPS_LIMIT = 3;

/** Remote image host allowed in next.config */
export const IMAGE_REMOTE_HOST = "images.unsplash.com";
