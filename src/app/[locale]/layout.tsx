import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { routing, type AppLocale } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeInitScript } from "@/providers/theme-init-script";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../globals.css";

const playfair = Playfair_Display({
 subsets: ["latin", "cyrillic"],
 variable: "--font-display",
 display: "swap",
});

const sourceSans = Source_Sans_3({
 subsets: ["latin", "cyrillic"],
 variable: "--font-sans",
 display: "swap",
});

export function generateStaticParams() {
 return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
 children: React.ReactNode;
 params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
 children,
 params,
}: LocaleLayoutProps) {
 const { locale } = await params;

 if (!hasLocale(routing.locales, locale)) {
 notFound();
 }

 setRequestLocale(locale);
 const messages = await getMessages();

 return (
 <html
 lang={locale}
 className={`${playfair.variable} ${sourceSans.variable} h-full`}
 suppressHydrationWarning
 >
 <head>
 <ThemeInitScript />
 </head>
 <body
 className="min-h-full flex flex-col font-sans antialiased"
 suppressHydrationWarning
 >
 <ThemeProvider>
 <QueryProvider>
 <AuthProvider>
 <NextIntlClientProvider messages={messages}>
 <TooltipProvider>
 <div className="flex min-h-full flex-col">{children}</div>
 </TooltipProvider>
 </NextIntlClientProvider>
 </AuthProvider>
 </QueryProvider>
 </ThemeProvider>
 </body>
 </html>
 );
}

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 const messages = (await import(`../../../messages/${locale as AppLocale}.json`))
 .default;

 return {
 title: messages.metadata.title,
 description: messages.metadata.description,
 };
}
