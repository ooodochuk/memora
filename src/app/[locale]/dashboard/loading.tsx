import { DashboardHomeSkeleton } from "@/components/design-system/skeletons";

export default function DashboardLoading() {
 return (
 <div aria-busy="true" aria-live="polite">
 <DashboardHomeSkeleton />
 </div>
 );
}
