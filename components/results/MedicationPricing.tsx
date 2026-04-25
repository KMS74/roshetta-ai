'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Factory, ExternalLink, TrendingDown, Info, Tag, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PriceEstimate, EgyptianAlternative } from '@/lib/types/prescription';

type MedicationPricingProps = {
  estimatedPrice?: PriceEstimate;
  egyptianAlternatives?: EgyptianAlternative[];
  medicationName: string;
};

export function MedicationPricing({
  estimatedPrice,
  egyptianAlternatives,
  medicationName,
}: MedicationPricingProps) {
  const t = useTranslations('Insights');
  const [isExpanded, setIsExpanded] = useState(false);

  const hasPrice = estimatedPrice && estimatedPrice.price > 0;
  const hasAlternatives = egyptianAlternatives && egyptianAlternatives.length > 0;

  if (!hasPrice && !hasAlternatives) return null;

  // Calculate max savings from alternatives
  const maxSavings =
    hasPrice && hasAlternatives
      ? Math.max(
          0,
          ...egyptianAlternatives.map(
            (alt) => estimatedPrice.price - alt.estimatedPrice.price
          )
        )
      : 0;

  return (
    <div className="mt-6 space-y-4">
      {/* ── Price Display ─────────────────────────────────────────── */}
      {hasPrice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 p-5 shadow-sm"
        >
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full bg-emerald-200/30 dark:bg-emerald-700/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Tag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {t('estimatedPrice')}
                </p>
              </div>
              <p className="text-3xl font-black tabular-nums tracking-tight text-emerald-800 dark:text-emerald-200">
                <span className="text-lg font-bold text-emerald-600/70 dark:text-emerald-400/70 me-1">
                  {estimatedPrice.currency}
                </span>
                {estimatedPrice.price}
              </p>

              {/* Savings teaser / Toggle Trigger */}
              {maxSavings > 0 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 flex items-center gap-1.5 transition-transform active:scale-95 group/savings"
                >
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200/50 dark:ring-emerald-700/30 group-hover/savings:ring-emerald-300 dark:group-hover/savings:ring-emerald-600">
                    <TrendingDown className="h-3 w-3" />
                    {t('savingsLabel', { amount: Math.round(maxSavings) })}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </span>
                </button>
              )}
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 dark:bg-slate-800/50 shadow-sm ring-1 ring-emerald-200/50 dark:ring-emerald-700/30">
              <span className="text-2xl" role="img" aria-label="medication">💊</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Egyptian Alternatives ──────────────────────────────────── */}
      {hasAlternatives && (
        <div className="space-y-3">
          {/* Section Header with Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between gap-3 group/header"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/80 dark:bg-amber-900/30 ring-1 ring-amber-200/50 dark:ring-amber-800/30">
                <span className="text-sm" role="img" aria-label="Egypt">🇪🇬</span>
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  {t('egyptianAlternatives')}
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black">
                    {egyptianAlternatives.length}
                  </span>
                </h4>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                  {t('alternativesHint')}
                </p>
              </div>
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-400 transition-all duration-300 group-hover/header:bg-emerald-50 dark:group-hover/header:bg-emerald-950/30 group-hover/header:text-emerald-500 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="space-y-2.5 pt-1 pb-2">
                  {egyptianAlternatives.map((alt, idx) => {
                    const savings =
                      hasPrice
                        ? Math.round(estimatedPrice.price - alt.estimatedPrice.price)
                        : 0;

                    return (
                      <motion.div
                        key={`${alt.name}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.25 }}
                        className="group/alt relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-800/50 transition-all duration-200 hover:shadow-md hover:ring-emerald-200/50 dark:hover:ring-emerald-700/30 hover:border-emerald-200/80 dark:hover:border-emerald-800/40"
                      >
                        {/* Best savings highlight */}
                        {savings > 0 && idx === 0 && (
                          <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 dark:from-emerald-500 dark:via-teal-500 dark:to-emerald-500" />
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            {/* Alt name + savings badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                {alt.name}
                              </h5>
                              {savings > 0 && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200/50 dark:ring-emerald-700/30">
                                  <TrendingDown className="h-2.5 w-2.5" />
                                  {t('savingsLabel', { amount: savings })}
                                </span>
                              )}
                            </div>

                            {/* Manufacturer + Price */}
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <Factory className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
                                {t('manufacturerLabel', { manufacturer: alt.manufacturer })}
                              </span>

                              {/* Alternative price badge */}
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30 px-2 py-0.5 text-xs font-black tabular-nums text-emerald-700 dark:text-emerald-300">
                                <Sparkles className="h-3 w-3" />
                                {alt.estimatedPrice.currency} {alt.estimatedPrice.price}
                              </span>
                            </div>

                            {/* Note */}
                            {alt.note && (
                              <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 italic">
                                💡 {alt.note}
                              </p>
                            )}
                          </div>

                          {/* Search pharmacy link */}
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(alt.name + ' pharmacy Egypt price')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex shrink-0 items-center gap-1 self-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-emerald-200/50 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-emerald-600 active:scale-95"
                          >
                            {t('searchAlternative')}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Disclaimer ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 px-3 py-2 shadow-sm">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
        <p className="text-[10px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
          {t('priceDisclaimer')}
        </p>
      </div>
    </div>
  );
}
