'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

type ResultsAnalyzingStateProps = {
  loadingStep: number;
  stepLabels: string[];
};

const STEP_COUNT = 4;

export function ResultsAnalyzingState({
  loadingStep,
  stepLabels,
}: ResultsAnalyzingStateProps) {
  const safeStep = Math.min(loadingStep, STEP_COUNT - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white px-8 py-14 shadow-xl shadow-slate-200/60"
    >
      <div className="relative mb-14">
        <div
          className="h-28 w-28 animate-spin rounded-full border-4 border-slate-100 border-t-brand-teal"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle2
            className={`h-9 w-9 transition-colors duration-300 ${
              safeStep >= 1 ? 'text-brand-green' : 'text-slate-200'
            }`}
            aria-hidden
          />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal/90">
            {safeStep + 1} / {STEP_COUNT}
          </p>
          <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
            {stepLabels[safeStep]}
          </h3>
        </div>

        <div className="flex flex-col gap-2" role="list" aria-label="Progress">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              role="listitem"
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-start text-sm transition-colors ${
                i === safeStep
                  ? 'border-brand-teal/30 bg-brand-teal/5 font-semibold text-slate-900'
                  : i < safeStep
                    ? 'border-emerald-100/80 bg-emerald-50/40 text-slate-600'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i < safeStep
                    ? 'bg-emerald-500 text-white'
                    : i === safeStep
                      ? 'bg-brand-teal text-white'
                      : 'bg-slate-200 text-slate-500'
                }`}
                aria-hidden
              >
                {i < safeStep ? '✓' : i + 1}
              </span>
              <span className="leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
