'use client';

import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ResultsEmptyState() {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-950 p-8 text-center sm:min-h-[500px]"
    >
      <div
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700"
        aria-hidden
      >
        <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500" strokeWidth={1.25} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 sm:text-2xl">
        {t('Insights.resultsEmptyTitle')}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
        {t('Insights.resultsEmptyHint')}
      </p>
    </motion.div>
  );
}
