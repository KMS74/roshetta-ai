export interface MedicationReminder {
  time: string;
  label: string;
}

export interface PriceEstimate {
  price: number;
  currency: string; // "EGP"
}

export interface EgyptianAlternative {
  name: string;
  manufacturer: string;
  estimatedPrice: PriceEstimate;
  note: string; // e.g., "Same active ingredient (Amoxicillin)"
}

export interface Medication {
  name: string;
  dosage: string;
  usage: string;
  tip: string;
  reminders: MedicationReminder[];
  estimatedPrice?: PriceEstimate;
  egyptianAlternatives?: EgyptianAlternative[];
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
