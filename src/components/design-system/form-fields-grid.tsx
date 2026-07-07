import type { ReactNode } from "react";
import { formFieldsGridClassName } from "@/lib/design-system/form-layout";
import { cn } from "@/lib/utils";

interface FormFieldsGridProps {
  children: ReactNode;
  className?: string;
}

export function FormFieldsGrid({ children, className }: FormFieldsGridProps) {
  return (
    <div className={cn(formFieldsGridClassName, className)}>{children}</div>
  );
}
