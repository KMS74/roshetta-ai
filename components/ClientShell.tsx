"use client";

import React from "react";
import { Header } from "@/components/Header";
import { ScanHistoryDrawer } from "@/components/history/ScanHistoryDrawer";
import { useHistory } from "@/context/HistoryContext";
import { usePathname, useRouter } from "next/navigation";

type ClientShellProps = {
  children: React.ReactNode;
};

/**
 * Client-side wrapper that manages the layout shell (Header + Footer)
 * and provides the global Scan History Drawer.
 */
export function ClientShell({ children }: ClientShellProps) {
  const { 
    isDrawerOpen, 
    closeDrawer, 
    openDrawer, 
    onRestore, 
    entries, 
    onDeleteScan, 
    onClearHistory,
    setPendingRestoreEntry
  } = useHistory();

  const pathname = usePathname();
  const router = useRouter();

  // Helper to check if we're on the home page (accounting for locale)
  const isHomePage = pathname === "/" || pathname === "/en" || pathname === "/ar";

  return (
    <>
      <Header onOpenHistory={openDrawer} />
      {children}
      <ScanHistoryDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        entries={entries}
        onRestore={(entry) => {
          if (isHomePage) {
            onRestore?.(entry);
          } else {
            // Save for later and go home
            setPendingRestoreEntry(entry);
            router.push("/");
          }
          closeDrawer();
        }}
        onDelete={onDeleteScan}
        onClearAll={onClearHistory}
      />
    </>
  );
}
