import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
 icon?: LucideIcon;
 title: string;
 description?: string;
 action?: ReactNode;
 className?: string;
 size?: "sm" | "md" | "lg";
}

const sizeStyles = {
 sm: {
 wrap: "py-8 px-5 sm:px-6",
 iconWrap: "mb-3 size-11",
 icon: "size-5",
 title: "text-base",
 desc: "text-sm",
 },
 md: {
 wrap: "py-12 px-6 sm:px-8 sm:py-14",
 iconWrap: "mb-4 size-14",
 icon: "size-6",
 title: "text-lg",
 desc: "text-sm sm:text-base",
 },
 lg: {
 wrap: "py-16 px-6 sm:px-8 sm:py-20",
 iconWrap: "mb-5 size-16",
 icon: "size-7",
 title: "text-xl",
 desc: "text-base",
 },
};

export function EmptyState({
 icon: Icon,
 title,
 description,
 action,
 className,
 size = "md",
}: EmptyStateProps) {
 const styles = sizeStyles[size];

 return (
 <div
 className={cn(
 "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card text-center ",
 styles.wrap,
 className,
 )}
 >
 {Icon && (
 <div
 className={cn(
 "flex items-center justify-center rounded-full bg-muted/60 text-primary",
 styles.iconWrap,
 )}
 >
 <Icon className={styles.icon} strokeWidth={1.5} aria-hidden />
 </div>
 )}
 <h3
 className={cn(
 "font-heading font-medium tracking-tight text-foreground",
 styles.title,
 )}
 >
 {title}
 </h3>
 {description && (
 <p
 className={cn(
 "mt-2 max-w-sm leading-relaxed text-muted-foreground",
 styles.desc,
 )}
 >
 {description}
 </p>
 )}
 {action && <div className="mt-5 sm:mt-6">{action}</div>}
 </div>
 );
}
