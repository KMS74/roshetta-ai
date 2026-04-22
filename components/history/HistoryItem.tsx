"use client";

import React from "react";
import { motion } from "motion/react";
import { Pill, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ScanHistoryEntry } from "@/lib/scan-history";

type HistoryItemProps = {
  entry: ScanHistoryEntry;
  index: number;
  onRestore: (entry: ScanHistoryEntry) => void;
  onDelete: (id: string) => void;
  formatDate: (timestamp: number) => string;
};

export function HistoryItem({
  entry,
  index,
  onRestore,
  onDelete,
  formatDate,
}: HistoryItemProps) {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className="group relative flex items-start gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 cursor-pointer transition-all hover:border-brand-teal/30 dark:hover:border-brand-teal/40 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 active:scale-[0.99]"
      onClick={() => onRestore(entry)}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-inner">
        {entry.thumbnail ? (
          <Image
            src={entry.thumbnail}
            alt={entry.summary || ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-teal/5 dark:bg-brand-teal/10">
            <Pill className="h-7 w-7 text-brand-teal/40 dark:text-brand-green/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-tight mb-1 group-hover:text-brand-teal dark:group-hover:text-brand-green transition-colors">
          {entry.summary || t("History.untitled", { defaultValue: "Prescription scan" })}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal dark:text-brand-green">
            <Pill className="h-3.5 w-3.5" />
            {t("History.medsCount", {
              count: entry.medicationCount,
              defaultValue: `${entry.medicationCount} meds`,
            })}
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            {formatDate(entry.timestamp)}
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(entry.id);
        }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 rounded-xl p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
        aria-label={t("History.delete", { defaultValue: "Delete" })}
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>
    </motion.div>
  );
}
