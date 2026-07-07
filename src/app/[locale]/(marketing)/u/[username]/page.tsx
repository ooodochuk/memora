import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routes } from "@/constants/routes";

interface LegacyUProfileRedirectProps {
  params: Promise<{ locale: string; username: string }>;
}

export default async function LegacyUProfileRedirect({
  params,
}: LegacyUProfileRedirectProps) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  redirect({ href: routes.profile(username), locale });
}
