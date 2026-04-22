'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

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
      className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-14 shadow-xl shadow-slate-200/60 dark:shadow-black/20"
    >
      <div className="relative mb-14">
        <div
          className="h-28 w-28 animate-spin rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-brand-teal dark:border-t-brand-green"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={`h-9 w-9 transition-colors duration-300 ${
              safeStep >= 1 ? 'text-brand-teal dark:text-brand-green' : 'text-slate-200 dark:text-slate-700'
            }`}
            aria-hidden
          />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal/90 dark:text-brand-green-light">
            {safeStep + 1} / {STEP_COUNT}
          </p>
          <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
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
                  ? 'border-brand-teal/30 dark:border-brand-teal/50 bg-brand-teal/5 dark:bg-brand-teal/20 font-semibold text-slate-900 dark:text-white'
                  : i < safeStep
                    ? 'border-emerald-100/80 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-600 dark:text-slate-400'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i < safeStep
                    ? 'bg-emerald-500 text-white'
                    : i === safeStep
                      ? 'bg-brand-teal dark:bg-brand-green text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
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
