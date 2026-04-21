'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import { useTransition } from 'react';
import { Languages, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === 'en' ? 'ar' : 'en';
  
  const locales = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'Arabic', native: 'العربية' }
  ];

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative group">
      <button 
        disabled={isPending}
        aria-label="Select Language"
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors focus:ring-2 focus:ring-brand-teal focus:outline-none"
      >
        <Languages className="h-4 w-4 text-brand-teal" />
        <span className="hidden sm:inline">
          {locales.find(l => l.code === locale)?.native}
        </span>
        <span className="sm:hidden uppercase">{locale}</span>
      </button>

      <div 
        role="menu"
        className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]"
      >
        {locales.map((l) => (
          <button
            key={l.code}
            role="menuitem"
            onClick={() => onSelectChange(l.code)}
            disabled={isPending}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:bg-brand-teal/5 focus:outline-none ${
              locale === l.code 
                ? 'bg-brand-teal/10 text-brand-teal' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-start leading-tight">
              <span>{l.native}</span>
              <span className="text-[10px] opacity-60 font-medium">{l.label}</span>
            </div>
            {locale === l.code && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
