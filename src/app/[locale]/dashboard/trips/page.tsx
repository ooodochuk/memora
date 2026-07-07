import { redirect } from "@/i18n/navigation";
import { dashboardRoutes } from "@/constants/routes";

interface TripsPageProps {
  params: Promise<{ locale: string }>;
}

/** Legacy route — adventures list lives on the dashboard home. */
export default async function TripsPage({ params }: TripsPageProps) {
  const { locale } = await params;
  redirect({ href: dashboardRoutes.home(), locale });
}
