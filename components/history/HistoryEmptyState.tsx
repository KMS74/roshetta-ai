"use client";

import React from "react";
import { motion } from "motion/react";
import { Clock, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export function HistoryEmptyState() {
  const t = useTranslations();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center px-6 py-16"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-teal/5 dark:bg-brand-teal/10" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <Search className="absolute -bottom-1 -right-1 h-6 w-6 text-brand-teal dark:text-brand-green bg-white dark:bg-slate-900 rounded-full p-1 border border-slate-100 dark:border-slate-800" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {t("History.empty", { defaultValue: "No scans yet" })}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed">
        {t("History.emptyHint", {
          defaultValue: "Your analyzed prescriptions will appear here for easy access and re-checking.",
        })}
      </p>
    </motion.div>
  );
}
