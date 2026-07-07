import { getTranslations } from "next-intl/server";

async function getAppName(locale?: string) {
 const t = locale
 ? await getTranslations({ locale, namespace: "common" })
 : await getTranslations("common");
 return t("appName");
}

export async function formatPageTitle(title: string, locale?: string) {
 const [t, appName] = await Promise.all([
 locale
 ? getTranslations({ locale, namespace: "metadata" })
 : getTranslations("metadata"),
 getAppName(locale),
 ]);
 return t("pageTitle", { title, appName });
}

export async function formatProfilePageTitle(name: string, locale?: string) {
 const [t, appName] = await Promise.all([
 locale
 ? getTranslations({ locale, namespace: "metadata" })
 : getTranslations("metadata"),
 getAppName(locale),
 ]);
 return t("profilePageTitle", { name, appName });
}

export async function formatTripPageTitle(
 tripTitle: string,
 authorName: string,
 locale?: string,
) {
 const [t, appName] = await Promise.all([
 locale
 ? getTranslations({ locale, namespace: "metadata" })
 : getTranslations("metadata"),
 getAppName(locale),
 ]);
 return t("tripPageTitle", { tripTitle, authorName, appName });
}

export async function formatProfileFallbackTitle(locale?: string) {
 const [t, appName] = await Promise.all([
 locale
 ? getTranslations({ locale, namespace: "metadata" })
 : getTranslations("metadata"),
 getAppName(locale),
 ]);
 return t("profileFallback", { appName });
}

export async function formatTripFallbackTitle(locale?: string) {
 const [t, appName] = await Promise.all([
 locale
 ? getTranslations({ locale, namespace: "metadata" })
 : getTranslations("metadata"),
 getAppName(locale),
 ]);
 return t("tripFallback", { appName });
}
