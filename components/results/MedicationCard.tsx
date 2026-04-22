'use client';

import { motion } from 'motion/react';
import { AlertTriangle, Clock, Stethoscope, ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatTime12h } from '@/lib/format-time';
import type { Medication } from '@/lib/types/prescription';

type MedicationCardProps = {
  medication: Medication;
  index: number;
};

export function MedicationCard({ medication, index }: MedicationCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100/80 dark:ring-slate-800 transition-shadow duration-300 hover:shadow-lg hover:ring-slate-200/80"
    >
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-brand-green transition-colors duration-300 group-hover:bg-brand-teal group-hover:text-white"
              aria-hidden
            >
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white sm:text-xl">
                {medication.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-bold text-brand-teal dark:text-brand-green-light">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{medication.dosage}</span>
                </div>
                
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(medication.name + ' medication uses')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
                >
                  <span>{t('Insights.searchWeb')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
 
          {medication.reminders.length > 0 && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:max-w-[220px] sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 sm:text-end">
                {t('Insights.remindersHeading')}
              </span>
              <ul className="flex flex-wrap gap-2 sm:justify-end">
                {medication.reminders.map((reminder, idx) => (
                  <li
                    key={`${reminder.time}-${idx}`}
                    className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-start"
                  >
                    <span className="block text-xs font-black tabular-nums tracking-tight text-slate-800 dark:text-slate-200">
                      {formatTime12h(reminder.time, locale)}
                    </span>
                    {reminder.label ? (
                      <span className="mt-0.5 block max-w-[10rem] truncate text-[10px] font-semibold leading-tight text-slate-700 dark:text-slate-300">
                        {reminder.label}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
 
        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('Insights.typicalUse')}
            </p>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 p-4">
              <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {medication.usage}
              </p>
            </div>
          </div>
 
          {medication.tip ? (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700/80 dark:text-amber-500/80">
                {t('Insights.safetyTip')}
              </p>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-100/80 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />
                <p className="text-xs font-semibold italic leading-relaxed text-amber-950/80 dark:text-amber-200/80">
                  {medication.tip}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
