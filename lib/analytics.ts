import { track } from "@vercel/analytics";

/**
 * Typed analytics event names used across the app.
 */
export type AnalyticsEvent =
  | "scan_started"
  | "scan_completed"
  | "scan_failed"
  | "scan_restored"
  | "pdf_downloaded"
  | "whatsapp_shared"
  | "results_copied"
  | "feedback_submitted"
  | "history_opened"
  | "history_cleared";

/**
 * Fire a custom analytics event. In production this goes to Vercel Analytics.
 * In development it logs to the console for debugging.
 */
export function trackEvent(
  event: AnalyticsEvent,
  data?: Record<string, string | number | boolean>
) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data || "");
    return;
  }

  try {
    track(event, data);
  } catch {
    // Silently fail — analytics should never break the app
  }
}
