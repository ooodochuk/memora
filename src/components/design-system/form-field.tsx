import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { ReactNode } from "react";

interface FormFieldProps {
 label: string;
 htmlFor: string;
 children: ReactNode;
 hint?: string;
 error?: string;
 className?: string;
}

export function FormField({
 label,
 htmlFor,
 children,
 hint,
 error,
 className,
}: FormFieldProps) {
 const hintId = `${htmlFor}-hint`;
 const errorId = `${htmlFor}-error`;

 return (
 <div className={cn("space-y-2", className)}>
 <Label
 htmlFor={htmlFor}
 className="text-sm font-medium text-foreground"
 >
 {label}
 </Label>
 {children}
 {hint && !error && (
 <p id={hintId} className="text-xs leading-relaxed text-muted-foreground">
 {hint}
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
