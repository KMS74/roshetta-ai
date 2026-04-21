import type { InteractionSeverity } from '@/lib/types/prescription';

export function interactionCardClasses(severity: InteractionSeverity): string {
  switch (severity) {
    case 'High':
      return 'bg-red-50/80 border-red-200 text-red-950 shadow-sm shadow-red-100/50';
    case 'Medium':
      return 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-sm shadow-amber-100/50';
    default:
      return 'bg-blue-50/80 border-blue-200 text-blue-950 shadow-sm shadow-blue-100/50';
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
