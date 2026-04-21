'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { AnalysisResult } from '@/lib/types/prescription';
import { ResultsAnalyzingState } from './ResultsAnalyzingState';
import { ResultsEmptyState } from './ResultsEmptyState';
import { ResultsSuccessPanel } from './ResultsSuccessPanel';

type ResultsPanelProps = {
  analyzing: boolean;
  result: AnalysisResult | null;
  loadingStep: number;
  loadingStepLabels: string[];
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
};

export function ResultsPanel({
  analyzing,
  result,
  loadingStep,
  loadingStepLabels,
  onDownloadPdf,
  isGeneratingPdf,
}: ResultsPanelProps) {
  const showSuccess = Boolean(result) && !analyzing;
  const showEmpty = !result && !analyzing;
  const showAnalyzing = analyzing;

  return (
    <motion.div
      layout
      className="relative min-h-[600px] rounded-3xl lg:min-h-[640px]"
      data-results-panel
    >
      <AnimatePresence mode="wait">
        {showEmpty && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <ResultsEmptyState />
          </motion.div>
        )}

        {showAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <ResultsAnalyzingState
              loadingStep={loadingStep}
              stepLabels={loadingStepLabels}
            />
          </motion.div>
        )}

        {showSuccess && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <ResultsSuccessPanel
              result={result}
              onDownloadPdf={onDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
