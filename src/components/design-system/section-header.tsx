import { cn } from "@/lib/utils";
import { Eyebrow, Heading, Lead } from "@/components/design-system/typography";
import type { ReactNode } from "react";

interface SectionHeaderProps {
 eyebrow?: string;
 title: string;
 subtitle?: string;
 align?: "left" | "center";
 className?: string;
 action?: ReactNode;
 divider?: boolean;
 titleAs?: "h1" | "h2" | "h3";
}

export function SectionHeader({
 eyebrow,
 title,
 subtitle,
 align = "left",
 className,
 action,
 divider = false,
 titleAs = "h2",
}: SectionHeaderProps) {
 const isCenter = align === "center";

 return (
 <header
 className={cn(
 "space-y-4",
 isCenter && "text-center",
 divider && "border-b border-border pb-8 sm:pb-10",
 className,
 )}
 >
 <div
 className={cn(
 "flex flex-col gap-4",
 action && !isCenter && "sm:flex-row sm:items-end sm:justify-between",
 isCenter && action && "items-center",
 )}
 >
 <div className={cn("space-y-3", isCenter && "mx-auto max-w-2xl")}>
 {eyebrow && (
 <Eyebrow className={isCenter ? "mx-auto" : undefined}>
 {eyebrow}
 </Eyebrow>
 )}
 <Heading as={titleAs}>{title}</Heading>
 {subtitle && (
 <Lead className={isCenter ? "mx-auto" : "max-w-2xl"}>
 {subtitle}
 </Lead>
 )}
 </div>
 {action && <div className="shrink-0">{action}</div>}
 </div>
 </header>
 );
}
