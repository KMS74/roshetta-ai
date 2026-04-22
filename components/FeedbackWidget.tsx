"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsUp, ThumbsDown, Send, Check, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { submitFeedback } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

type FeedbackWidgetProps = {
  scanSummary?: string;
};

export function FeedbackWidget({ scanSummary }: FeedbackWidgetProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"ask" | "comment" | "done">("ask");
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (value: "positive" | "negative") => {
    setRating(value);
    setStep("comment");
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);

    await submitFeedback({
      rating,
      comment: comment.trim() || undefined,
      scan_summary: scanSummary,
      locale,
    });

    trackEvent("feedback_submitted", {
      rating,
      hasComment: comment.trim() ? "yes" : "no",
    });
    setStep("done");
    setSubmitting(false);
  };

  const handleSkip = async () => {
    if (!rating) return;
    setSubmitting(true);

    await submitFeedback({
      rating,
      scan_summary: scanSummary,
      locale,
    });

    trackEvent("feedback_submitted", { rating, hasComment: "no" });
    setStep("done");
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5"
    >
      <AnimatePresence mode="wait">
        {step === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-teal dark:text-brand-green" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t("Feedback.question", {
                  defaultValue: "Was this analysis helpful?",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRating("positive")}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/30 active:scale-[0.97]"
              >
                <ThumbsUp className="h-4 w-4" />
                {t("Feedback.yes", { defaultValue: "Yes" })}
              </button>
              <button
                onClick={() => handleRating("negative")}
                className="flex items-center gap-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-bold text-red-500 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-[0.97]"
              >
                <ThumbsDown className="h-4 w-4" />
                {t("Feedback.no", { defaultValue: "No" })}
              </button>
            </div>
          </motion.div>
        )}

        {step === "comment" && (
          <motion.div
            key="comment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("Feedback.commentPrompt", {
                defaultValue: "Any additional feedback? (optional)",
              })}
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("Feedback.commentPlaceholder", {
                defaultValue: "Tell us how we can improve...",
              })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-colors resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                {t("Feedback.skip", { defaultValue: "Skip" })}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl bg-brand-teal px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {t("Feedback.submit", { defaultValue: "Submit" })}
              </button>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {t("Feedback.thanks", {
                defaultValue: "Thank you for your feedback!",
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
