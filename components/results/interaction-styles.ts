import type { InteractionSeverity } from '@/lib/types/prescription';

export function interactionCardClasses(severity: InteractionSeverity): string {
  switch (severity) {
    case 'High':
      return 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200 shadow-sm shadow-red-100/50 dark:shadow-none';
    case 'Medium':
      return 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200 shadow-sm shadow-amber-100/50 dark:shadow-none';
    default:
      return 'bg-blue-50/80 dark:bg-brand-teal/20 border-blue-200 dark:border-brand-teal/40 text-blue-950 dark:text-blue-200 shadow-sm shadow-blue-100/50 dark:shadow-none';
  }
}

export function interactionDotClass(severity: InteractionSeverity): string {
  switch (severity) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-amber-500';
    default:
      return 'bg-blue-500';
  }
}
