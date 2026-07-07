import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

const headingStyles: Record<HeadingLevel, string> = {
 h1: "text-4xl sm:text-5xl md:text-6xl leading-[1.08]",
 h2: "text-3xl sm:text-4xl leading-[1.12]",
 h3: "text-xl sm:text-2xl leading-snug",
 h4: "text-lg sm:text-xl leading-snug",
};

interface HeadingProps {
 as?: HeadingLevel;
 children: ReactNode;
 className?: string;
 balance?: boolean;
}

export function Heading({
 as: Tag = "h2",
 children,
 className,
 balance = true,
}: HeadingProps) {
 return (
 <Tag
 className={cn(
 "font-heading font-medium tracking-tight text-foreground",
 headingStyles[Tag],
 balance && "text-balance",
 className,
 )}
 >
 {children}
 </Tag>
 );
}

interface EyebrowProps {
 children: ReactNode;
 className?: string;
 variant?: "default" | "subtitle";
}

const eyebrowVariants = {
 default:
 "text-[0.6875rem] font-medium tracking-[0.12em] text-muted-foreground sm:text-xs",
 subtitle:
 "text-xs font-medium tracking-wide text-muted-foreground sm:text-[0.8125rem]",
};

export function Eyebrow({
 children,
 className,
 variant = "default",
}: EyebrowProps) {
 return (
 <p className={cn(eyebrowVariants[variant], className)}>{children}</p>
 );
}

interface LeadProps {
 children: ReactNode;
 className?: string;
}

export function Lead({ children, className }: LeadProps) {
 return (
 <p
 className={cn(
 "text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed",
 className,
 )}
 >
 {children}
 </p>
 );
}

interface ProseProps {
 children: ReactNode;
 className?: string;
 size?: "sm" | "base" | "lg";
}

const proseSizes = {
 sm: "text-sm leading-relaxed",
 base: "text-base leading-[1.75]",
 lg: "text-lg leading-[1.75]",
};

export function Prose({ children, className, size = "base" }: ProseProps) {
 return (
 <div
 className={cn(
 "text-foreground",
 proseSizes[size],
 "[&_p+p]:mt-4",
 className,
 )}
 >
 {children}
 </div>
 );
}

interface MetaTextProps {
 children: ReactNode;
 className?: string;
}

export function MetaText({ children, className }: MetaTextProps) {
 return (
 <span
 className={cn(
 "text-xs text-muted-foreground sm:text-sm",
 className,
 )}
 >
 {children}
 </span>
 );
}
