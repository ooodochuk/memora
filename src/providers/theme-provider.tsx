"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { appThemeIds } from "@/lib/design-system/themes";

export function ThemeProvider({ children }: { children: ReactNode }) {
 return (
 <NextThemesProvider
 attribute="class"
 defaultTheme="dark"
 enableSystem={false}
 themes={[...appThemeIds]}
 disableTransitionOnChange
 >
 {children}
 </NextThemesProvider>
 );
}
