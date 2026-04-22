import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase client instance. Only usable when env vars are configured.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Feedback entry to submit to Supabase.
 */
export interface FeedbackData {
  rating: "positive" | "negative";
  comment?: string;
  scan_summary?: string;
  locale: string;
}

/**
 * Submit user feedback to the Supabase `feedback` table.
 * Returns true on success, false on failure.
 *
 * Table schema:
 *   id          uuid        (auto-generated)
 *   rating      text        ('positive' or 'negative')
 *   comment     text        (nullable)
 *   scan_summary text       (nullable)
 *   locale      text
 *   created_at  timestamptz (auto-generated)
 */
export async function submitFeedback(data: FeedbackData): Promise<boolean> {
  if (!supabase) {
    console.warn(
      "[Feedback] Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return false;
  }

  try {
    const { error } = await supabase.from("feedback").insert({
      rating: data.rating,
      comment: data.comment || null,
      scan_summary: data.scan_summary || null,
      locale: data.locale,
    });

    if (error) {
      console.error("[Feedback] Insert error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Feedback] Unexpected error:", err);
    return false;
  }
}
