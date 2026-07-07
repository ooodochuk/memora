import { PageContainer } from "@/components/design-system/page-container";
import { EmptyState } from "@/components/design-system/empty-state";
import { SectionHeader } from "@/components/design-system/section-header";

interface DashboardPageContentProps {
 title: string;
 subtitle: string;
 eyebrow?: string;
 placeholder?: string;
 action?: React.ReactNode;
 children?: React.ReactNode;
}

export function DashboardPageContent({
 title,
 subtitle,
 eyebrow,
 placeholder,
 action,
 children,
}: DashboardPageContentProps) {
 return (
 <PageContainer spacing="md" className="space-y-8">
 <SectionHeader
 eyebrow={eyebrow}
 title={title}
 subtitle={subtitle}
 action={action}
 />
 {children ??
 (placeholder ? (
 <EmptyState size="sm" title={placeholder} className="py-10" />
 ) : null)}
 </PageContainer>
 );
}
