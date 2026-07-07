import { setRequestLocale } from "next-intl/server";
import { TripWorkspaceLayout } from "@/components/dashboard/trip/trip-workspace-layout";

interface TripIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}

export default async function TripIdLayout({
  children,
  params,
}: TripIdLayoutProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <TripWorkspaceLayout adventureId={id}>{children}</TripWorkspaceLayout>
  );
}
