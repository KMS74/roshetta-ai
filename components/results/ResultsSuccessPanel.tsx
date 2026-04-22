'use client';

import { motion } from 'motion/react';
import type { AnalysisResult } from '@/lib/types/prescription';
import { DrugInteractionsSection } from './DrugInteractionsSection';
import { MedicationCard } from './MedicationCard';
import { ResultsSummaryHeader } from './ResultsSummaryHeader';
import { ShareActions } from './ShareActions';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

type ResultsSuccessPanelProps = {
  result: AnalysisResult;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
};

export function ResultsSuccessPanel({
  result,
  onDownloadPdf,
  isGeneratingPdf,
}: ResultsSuccessPanelProps) {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <ResultsSummaryHeader
        medicationCount={result.medications.length}
        onDownloadPdf={onDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ShareActions result={result} />
          
          <a
            href="https://www.google.com/maps/search/pharmacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
          >
            <MapPin className="h-4 w-4 text-brand-teal dark:text-brand-green" />
            <span>{t('Navigation.findPharmacy', { defaultValue: 'Find Pharmacy' })}</span>
          </a>
        </div>
        
        {result.summary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-brand-teal/20 dark:border-brand-teal/40 bg-brand-teal/5 dark:bg-brand-teal/20 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal dark:bg-brand-teal-light text-[10px] text-white font-bold">
                i
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-teal dark:text-brand-green-light">
                {t('Insights.summaryLabel')}
              </h3>
            </div>
            <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200">
              {result.summary}
            </p>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {result.medications.map((medication, index) => (
          <MedicationCard
            key={`${medication.name}-${index}`}
            medication={medication}
            index={index}
          />
        ))}
      </div>

      <DrugInteractionsSection
        interactions={result.interactions}
        disclaimer={result.disclaimer}
      />

      <FeedbackWidget scanSummary={result.summary} />
    </motion.div>
  );
}
