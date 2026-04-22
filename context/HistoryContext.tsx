"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ScanHistoryEntry } from "@/lib/scan-history";
import { getHistory, deleteScan, clearHistory } from "@/lib/scan-history";

type HistoryContextType = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  entries: ScanHistoryEntry[];
  refreshHistory: () => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  pendingRestoreEntry: ScanHistoryEntry | null;
  setPendingRestoreEntry: (entry: ScanHistoryEntry | null) => void;
  onRestore: ((entry: ScanHistoryEntry) => void) | null;
  registerRestoreHandler: (handler: (entry: ScanHistoryEntry) => void) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [pendingRestoreEntry, setPendingRestoreEntry] = useState<ScanHistoryEntry | null>(null);
  const [onRestore, setOnRestore] = useState<((entry: ScanHistoryEntry) => void) | null>(null);

  const refreshHistory = useCallback(() => {
    setEntries(getHistory());
  }, []);

  const openDrawer = useCallback(() => {
    refreshHistory();
    setIsDrawerOpen(true);
  }, [refreshHistory]);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const onDeleteScan = useCallback((id: string) => {
    deleteScan(id);
    refreshHistory();
  }, [refreshHistory]);

  const onClearHistory = useCallback(() => {
    clearHistory();
    setEntries([]);
  }, []);

  const registerRestoreHandler = useCallback((handler: (entry: ScanHistoryEntry) => void) => {
    setOnRestore(() => handler);
  }, []);

  // Initialize history on mount (optional, but good for pre-fetching)
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <HistoryContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        entries,
        refreshHistory,
        onDeleteScan,
        onClearHistory,
        pendingRestoreEntry,
        setPendingRestoreEntry,
        onRestore,
        registerRestoreHandler,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
