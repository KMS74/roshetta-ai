export interface MedicationReminder {
  time: string;
  label: string;
}

export interface Medication {
  name: string;
  dosage: string;
  usage: string;
  tip: string;
  reminders: MedicationReminder[];
}

export interface Interaction {
  severity: string;
  description: string;
}

export interface AnalysisResult {
  summary: string;
  medications: Medication[];
  interactions: Interaction[];
  disclaimer: string;
}

export type InteractionSeverity = 'High' | 'Medium' | 'Low';

export function normalizeInteractionSeverity(raw: string): InteractionSeverity {
  const v = (raw || '').trim().toLowerCase();
  if (v.startsWith('h') || v.includes('high')) return 'High';
  if (v.startsWith('m') || v.includes('medium')) return 'Medium';
  return 'Low';
}
