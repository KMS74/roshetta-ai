"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ScanHistoryEntry } from "@/lib/scan-history";
import { HistoryItem } from "./HistoryItem";
import { HistoryEmptyState } from "./HistoryEmptyState";

type ScanHistoryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  entries: ScanHistoryEntry[];
  onRestore: (entry: ScanHistoryEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
};

export function ScanHistoryDrawer({
  isOpen,
  onClose,
  entries,
  onRestore,
  onDelete,
  onClearAll,
}: ScanHistoryDrawerProps) {
  const t = useTranslations();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return t("History.justNow", { defaultValue: "Just now" });
    if (diffMin < 60)
      return t("History.minutesAgo", {
        count: diffMin,
        defaultValue: `${diffMin}m ago`,
      });
    if (diffHr < 24)
      return t("History.hoursAgo", {
        count: diffHr,
        defaultValue: `${diffHr}h ago`,
      });
    if (diffDay < 7)
      return t("History.daysAgo", {
        count: diffDay,
        defaultValue: `${diffDay}d ago`,
      });
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col rtl:right-auto rtl:left-0 border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20">
                  <Clock className="h-6 w-6 text-brand-teal dark:text-brand-green" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1">
                    {t("History.title", { defaultValue: "Recent Scans" })}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t("History.itemsCount", { count: entries.length, defaultValue: `${entries.length} items` })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all active:scale-90"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
              {entries.length === 0 ? (
                <HistoryEmptyState />
              ) : (
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      index={index}
                      onRestore={onRestore}
                      onDelete={onDelete}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer: Clear All */}
            <AnimatePresence>
              {entries.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          t("History.clearConfirm", {
                            defaultValue: "Clear all scan history?",
                          }),
                        )
                      ) {
                        onClearAll();
                      }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-800 px-4 py-4 text-sm font-bold text-red-500 shadow-sm border border-red-100 dark:border-red-900/30 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98]"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {t("History.clearAll", { defaultValue: "Clear All History" })}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
