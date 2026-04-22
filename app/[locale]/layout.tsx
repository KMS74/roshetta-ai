import type { Viewport } from "next";
import { Cairo, Outfit } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientShell } from "@/components/ClientShell";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { HistoryProvider } from "@/context/HistoryContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-family-arabic",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-family-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(cairo.variable, outfit.variable)}
      suppressHydrationWarning
    >
      <body
        className={cn("antialiased", isArabic ? "font-arabic" : "font-sans")}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <HistoryProvider>
              <div className="min-h-screen bg-brand-bg flex flex-col transition-colors duration-500">
                <ClientShell>
                  {children}
                </ClientShell>
                <Footer />
              </div>
            </HistoryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
