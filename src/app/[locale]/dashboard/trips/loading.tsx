import { DashboardTripsPageSkeleton } from "@/components/design-system/skeletons";

export default function TripsLoading() {
 return (
 <div aria-busy="true" aria-live="polite">
 <DashboardTripsPageSkeleton />
 </div>
 );
}
