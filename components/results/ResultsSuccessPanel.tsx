'use client';

import { motion } from 'motion/react';
import type { AnalysisResult } from '@/lib/types/prescription';
import { DrugInteractionsSection } from './DrugInteractionsSection';
import { MedicationCard } from './MedicationCard';
import { ResultsSummaryHeader } from './ResultsSummaryHeader';

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
    </motion.div>
  );
}
