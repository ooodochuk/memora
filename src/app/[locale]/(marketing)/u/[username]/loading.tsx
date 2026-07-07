import { PageContainer } from "@/components/design-system/page-container";
import {
 ProfileHeroSkeleton,
 TripGridSkeleton,
} from "@/components/design-system/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfileLoading() {
 return (
 <div aria-busy="true" aria-live="polite">
 <ProfileHeroSkeleton />
 <PageContainer className="space-y-16 py-12 sm:space-y-20 sm:py-16">
 <div className="grid gap-4 sm:grid-cols-3">
 {Array.from({ length: 3 }).map((_, i) => (
 <Skeleton key={i} className="h-20 rounded-2xl" />
 ))}
 </div>
 <div className="space-y-4">
 <Skeleton className="h-6 w-40 rounded-md" />
 <div className="flex flex-wrap gap-2">
 {Array.from({ length: 5 }).map((_, i) => (
 <Skeleton key={i} className="h-8 w-24 rounded-full" />
 ))}
 </div>
 </div>
 <div className="space-y-4">
 <Skeleton className="h-6 w-32 rounded-md" />
 <TripGridSkeleton count={4} className="lg:grid-cols-2" />
 </div>
 </PageContainer>
 </div>
 );
}
