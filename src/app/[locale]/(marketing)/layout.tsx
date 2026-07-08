import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppToastProvider } from "@/components/design-system/app-toast";

export default function MarketingLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <AppToastProvider>
 <SiteHeader />
 <main className="flex-1">{children}</main>
 <SiteFooter />
 </AppToastProvider>
 );
}
