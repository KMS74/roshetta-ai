'use client';

import { Clock, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ResultsSummaryHeaderProps = {
  medicationCount: number;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
};

export function ResultsSummaryHeader({
  medicationCount,
  onDownloadPdf,
  isGeneratingPdf,
}: ResultsSummaryHeaderProps) {
  const t = useTranslations();

  return (
    <div className="sticky top-20 z-20 -mx-1 mb-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 sm:flex sm:items-center sm:justify-between sm:px-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
          {t('Insights.resultsSectionLabel')}
        </p>
        <h2 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {t('Insights.medications')}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t('Insights.itemsIdentified', { count: medicationCount })}
        </p>
      </div>
      <div className="mt-4 shrink-0 sm:mt-0 sm:ps-4">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          aria-label={t('Insights.downloadPDF')}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {isGeneratingPdf ? (
            <Clock className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          ) : (
            <Download className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span>{t('Insights.downloadPDF')}</span>
        </button>
      </div>
    </div>
  );
}
