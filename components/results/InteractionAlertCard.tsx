'use client';

import { useTranslations } from 'next-intl';
import type { Interaction, InteractionSeverity } from '@/lib/types/prescription';
import { normalizeInteractionSeverity } from '@/lib/types/prescription';
import { interactionCardClasses, interactionDotClass } from './interaction-styles';

function severityLabelKey(severity: InteractionSeverity): string {
  switch (severity) {
    case 'High':
      return 'Insights.severityDisplayHigh';
    case 'Medium':
      return 'Insights.severityDisplayMedium';
    default:
      return 'Insights.severityDisplayLow';
  }
}

type InteractionAlertCardProps = {
  interaction: Interaction;
};

export function InteractionAlertCard({ interaction }: InteractionAlertCardProps) {
  const t = useTranslations();
  const severity = normalizeInteractionSeverity(interaction.severity);

  return (
    <div
      className={`rounded-2xl border-2 p-5 sm:p-6 ${interactionCardClasses(severity)}`}
      role="status"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div
          className={`h-2 w-2 shrink-0 rounded-full animate-pulse ${interactionDotClass(severity)}`}
          aria-hidden
        />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">
          {t(severityLabelKey(severity))}
        </span>
      </div>
      <p className="text-sm font-bold leading-relaxed">{interaction.description}</p>
    </div>
  );
}
