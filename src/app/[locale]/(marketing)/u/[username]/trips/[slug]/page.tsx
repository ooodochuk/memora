import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routes } from "@/constants/routes";

interface LegacyUTripRedirectProps {
  params: Promise<{ locale: string; username: string; slug: string }>;
}

export default async function LegacyUTripRedirect({
  params,
}: LegacyUTripRedirectProps) {
  const { locale, username, slug } = await params;
  setRequestLocale(locale);
  redirect({ href: routes.trip(username, slug), locale });
}
