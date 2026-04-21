import type { Viewport } from 'next';
import { Cairo, Outfit } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-family-arabic',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-family-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cn(cairo.variable, outfit.variable)}
    >
      <body
        className={cn(
          'antialiased',
          isArabic ? 'font-arabic' : 'font-sans'
        )}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
