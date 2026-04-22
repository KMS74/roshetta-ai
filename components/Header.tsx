'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Header() {
  const t = useTranslations();

  return (
    <header role="banner" className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-brand-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          aria-label={t('Common.brandName')}
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="rounded-xl bg-brand-teal p-2 shadow-lg shadow-brand-teal/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('Common.brandName')}</span>
        </Link>
 
        <nav aria-label={t('Navigation.home')} className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors">{t('Navigation.home')}</Link>
          <Link href="/about" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors">{t('Navigation.about')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
