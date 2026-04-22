'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useCallback, useEffect, useId, useRef, useState, useTransition } from 'react';
import { Languages, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const locales = [
    { code: 'en' as const, label: 'English', native: 'English' },
    { code: 'ar' as const, label: 'Arabic', native: 'العربية' },
  ];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={isPending}
        id={`${listId}-trigger`}
        aria-label={open ? t('closeLanguageMenu') : t('openLanguageMenu')}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={`${listId}-menu`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:outline-none disabled:opacity-60"
      >
        <Languages className="h-4 w-4 text-brand-teal dark:text-brand-green-light shrink-0" aria-hidden />
        <span className="hidden sm:inline">
          {locales.find((l) => l.code === locale)?.native}
        </span>
        <span className="sm:hidden uppercase">{locale}</span>
      </button>
 
      {open && (
        <div
          ref={menuRef}
          id={`${listId}-menu`}
          role="menu"
          aria-labelledby={`${listId}-trigger`}
          className="absolute end-0 top-full z-[100] mt-2 w-48 origin-top rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitem"
              onClick={() => onSelectChange(l.code)}
              disabled={isPending}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:bg-brand-teal/5 dark:focus-visible:bg-brand-teal/20 focus-visible:outline-none ${
                locale === l.code
                  ? 'bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-brand-green'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col items-start leading-tight text-start">
                <span>{l.native}</span>
                <span className="text-[10px] opacity-60 font-medium">{l.label}</span>
              </div>
              {locale === l.code && <Check className="h-4 w-4 shrink-0" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
