import { cn } from "@/lib/utils";
import { containerSizes, sectionSpacing } from "@/lib/design-system/tokens";
import type { ReactNode } from "react";

type ContainerSize = keyof typeof containerSizes;
type SectionSpace = keyof typeof sectionSpacing;

interface PageContainerProps {
 children: ReactNode;
 className?: string;
 as?: "div" | "section" | "main" | "article";
 size?: ContainerSize;
 spacing?: SectionSpace | "none";
 narrow?: boolean;
}

export function PageContainer({
 children,
 className,
 as: Component = "div",
 size = "dashboard",
 spacing = "none",
 narrow = false,
}: PageContainerProps) {
 return (
 <Component
 className={cn(
 "mx-auto w-full px-5 sm:px-6 lg:px-10",
 narrow ? containerSizes.prose : containerSizes[size],
 spacing !== "none" && sectionSpacing[spacing],
 className,
 )}
 >
 {children}
 </Component>
 );
}

interface PageSectionProps {
 children: ReactNode;
 className?: string;
 innerClassName?: string;
 spacing?: SectionSpace;
 variant?: "default" | "muted" | "paper";
 id?: string;
}

const sectionVariants = {
 default: "",
 muted: "border-y border-border bg-muted/40",
 paper: "border-y border-border bg-muted/40",
};

export function PageSection({
 children,
 className,
 innerClassName,
 spacing = "md",
 variant = "default",
 id,
}: PageSectionProps) {
 return (
 <section id={id} className={cn(sectionVariants[variant], className)}>
 <PageContainer spacing={spacing} className={innerClassName}>
 {children}
 </PageContainer>
 </section>
 );
}
