import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { AppToastProvider } from "@/components/design-system/app-toast";

export function AppShell({ children }: { children: React.ReactNode }) {
 return (
 <AppToastProvider>
 <div className="flex min-h-screen bg-background">
 <DashboardSidebar />

 <div className="flex min-w-0 flex-1 flex-col">
 <DashboardHeader />

 <main className="flex-1 pb-24 lg:pb-0">
 {children}
 </main>
 </div>

 <DashboardMobileNav />
 </div>
 </AppToastProvider>
 );
}
