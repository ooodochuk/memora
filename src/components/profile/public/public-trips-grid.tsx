import { getTranslations } from "next-intl/server";
import type { Trip } from "@/types";
import { TripCard } from "@/components/trips/trip-card";
import { EmptyState } from "@/components/design-system/empty-state";
import { Map } from "lucide-react";

interface PublicTripsGridProps {
 trips: Trip[];
 username: string;
}

export async function PublicTripsGrid({
 trips,
 username,
}: PublicTripsGridProps) {
 const t = await getTranslations("publicProfile");

 return (
 <section className="space-y-3">
 <h2 className="font-heading text-lg font-medium tracking-tight sm:text-xl">
  {t("trips.title")}
 </h2>

 {trips.length === 0 ? (
 <EmptyState
 icon={Map}
 title={t("trips.emptyTitle")}
 description={t("trips.emptyDescription")}
 size="md"
 />
 ) : (
 <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
 {trips.map((trip) => (
 <TripCard key={trip.id} trip={trip} username={username} />
 ))}
 </div>
 )}
 </section>
 );
}
