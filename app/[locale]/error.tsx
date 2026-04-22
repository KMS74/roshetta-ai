"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <main
      role="main"
      className="flex-grow flex items-center justify-center px-4 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          {t("Errors.errorTitle", { defaultValue: "Something went wrong" })}
        </h1>

        <p className="text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {t("Errors.errorDescription", {
            defaultValue: "An unexpected error occurred. Please try again.",
          })}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:shadow-xl hover:shadow-brand-teal/30 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            {t("Errors.tryAgain", { defaultValue: "Try Again" })}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            {t("Errors.goHome", { defaultValue: "Go Home" })}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
