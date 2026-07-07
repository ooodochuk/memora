import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { formLabelClassName } from "@/lib/design-system/form-layout";
import type { ReactNode } from "react";

interface FormFieldProps {
 label: string;
 htmlFor: string;
 children: ReactNode;
 hint?: string;
 optional?: boolean;
 error?: string;
 className?: string;
 labelClassName?: string;
}

export function FormField({
 label,
 htmlFor,
 children,
 hint,
 optional = false,
 error,
 className,
 labelClassName,
}: FormFieldProps) {
 const t = useTranslations("common");
 const hintId = `${htmlFor}-hint`;
 const errorId = `${htmlFor}-error`;
 const resolvedHint = hint ?? (optional ? t("optional") : undefined);

 return (
 <div className={cn("min-w-0 space-y-2", className)}>
 <Label
 htmlFor={htmlFor}
 className={cn("text-sm font-medium text-foreground", formLabelClassName, labelClassName)}
 >
 {label}
 </Label>
 {children}
 {resolvedHint && !error && (
 <p id={hintId} className="text-xs text-muted-foreground">
 {resolvedHint}
 </p>
 )}
 {error && (
 <p id={errorId} className="text-xs text-destructive" role="alert">
 {error}
 </p>
 )}
 </div>
 );
}
