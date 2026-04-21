'use client';

import { AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Interaction } from '@/lib/types/prescription';
import { InteractionAlertCard } from './InteractionAlertCard';

type DrugInteractionsSectionProps = {
  interactions: Interaction[];
  disclaimer: string;
};

export function DrugInteractionsSection({
  interactions,
  disclaimer,
}: DrugInteractionsSectionProps) {
  const t = useTranslations();
  const hasRisk = interactions.length > 0;

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:rounded-[2.5rem] sm:p-8"
      aria-labelledby="interactions-heading"
    >
      <div
        className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-brand-teal/[0.07] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                hasRisk ? 'bg-red-50 text-red-600 ring-1 ring-red-100' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
              }`}
              aria-hidden
            >
              {hasRisk ? (
                <AlertTriangle className="h-7 w-7" />
              ) : (
                <ShieldCheck className="h-7 w-7" />
              )}
            </div>
            <div>
              <h3 id="interactions-heading" className="text-xl font-black text-slate-900">
                {t('Insights.interactions')}
              </h3>
              <p className="mt-1 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                {t('Insights.interactionsLead')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {hasRisk ? (
            interactions.map((interaction, i) => (
              <InteractionAlertCard key={`${interaction.description.slice(0, 32)}-${i}`} interaction={interaction} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-100/90 bg-gradient-to-b from-emerald-50/40 to-white py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50">
                <CheckCircle2 className="h-8 w-8" aria-hidden />
              </div>
              <p className="max-w-md px-4 text-sm font-bold leading-relaxed text-slate-600">
                {t('Insights.noInteractions')}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <div className="flex items-start gap-4 rounded-2xl border border-red-100/80 bg-red-50/40 p-4 sm:p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
            <p className="text-xs font-semibold leading-relaxed text-red-950/70">
              <span className="font-black text-red-900/90">{t('Report.disclaimerTitle')}:</span>{' '}
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
