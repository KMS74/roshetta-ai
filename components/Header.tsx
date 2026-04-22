'use client';

import React, { useState } from 'react';
import { Brain, Clock, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'motion/react';
import { useHistory } from '@/context/HistoryContext';
import { BrandLogo } from './BrandLogo';

type HeaderProps = {
  onOpenHistory?: () => void;
};

export function Header({ onOpenHistory }: HeaderProps) {
  const t = useTranslations();
  const { entries } = useHistory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const entriesCount = entries.length;

  const navLinks = [
    { href: '/' as const, label: t('Navigation.home') },
    { href: '/about' as const, label: t('Navigation.about') },
  ];

  return (
    <header role="banner" className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-brand-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          aria-label={t('Common.brandName')}
          className="transition-transform hover:scale-105"
        >
          <BrandLogo />
        </Link>
 
        {/* Desktop Nav */}
        <nav aria-label={t('Navigation.home')} className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* History Button with Badge */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-teal dark:hover:text-brand-green transition-all active:scale-95"
              aria-label={t('History.title', { defaultValue: 'Recent Scans' })}
              title={t('History.title', { defaultValue: 'Recent Scans' })}
            >
              <Clock className="h-5 w-5 transition-transform group-hover:rotate-12" />
              
              <AnimatePresence>
                {entriesCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    key={entriesCount}
                    className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-teal dark:bg-brand-green text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-brand-bg"
                  >
                    {entriesCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          <ThemeToggle />
          <LanguageSwitcher />

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-brand-bg md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {onOpenHistory && (
                <button
                  onClick={() => {
                    onOpenHistory();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-teal dark:hover:text-brand-green transition-colors w-full text-start"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    {t('History.title', { defaultValue: 'Recent Scans' })}
                  </div>
                  {entriesCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal/10 dark:bg-brand-green/20 text-xs text-brand-teal dark:text-brand-green">
                      {entriesCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
