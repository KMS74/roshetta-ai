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
      className="flex h-full min-h-[520px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 px-8 py-14 text-center shadow-inner"
    >
      <div
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 ring-1 ring-slate-200/80"
        aria-hidden
      >
        <FileText className="h-12 w-12 text-slate-400" strokeWidth={1.25} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-slate-700 sm:text-2xl">
        {t('Insights.resultsEmptyTitle')}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
        {t('Insights.resultsEmptyHint')}
      </p>
    </motion.div>
  );
}
