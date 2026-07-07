import { getTranslations } from "next-intl/server";
import type { CloudLink } from "@/types";
import { CloudLinkCard } from "@/components/cloud-links/cloud-link-card";
import { SectionHeader } from "@/components/design-system/section-header";

interface PublicTripCloudContentProps {
 mediaLinks: CloudLink[];
 allLinks: CloudLink[];
}

export async function PublicTripCloudContent({
 mediaLinks,
 allLinks,
}: PublicTripCloudContentProps) {
 const t = await getTranslations("publicTrip.cloudContent");

 if (allLinks.length === 0) return null;

 const featured = mediaLinks.length > 0 ? mediaLinks : allLinks;
 const additional = allLinks.filter(
 (link) => !featured.some((item) => item.id === link.id),
 );

 return (
 <section className="space-y-8">
 <SectionHeader
 eyebrow={t("eyebrow")}
 title={t("title")}
 subtitle={t("subtitle")}
 divider
 />

 <div className="space-y-4">
 {featured.map((link) => (
 <CloudLinkCard key={link.id} link={link} />
 ))}
 </div>

 {additional.length > 0 && (
 <div className="space-y-4">
 <h3 className="font-heading text-lg font-medium tracking-tight">
 {t("moreLinks")}
 </h3>
 {additional.map((link) => (
 <CloudLinkCard key={link.id} link={link} />
 ))}
 </div>
 )}
 </section>
 );
}
