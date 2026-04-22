"use client";

import { motion } from "motion/react";
import { Search, Home, Brain } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {
  const t = useTranslations();

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
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-teal/10 dark:bg-brand-teal/20">
          <Search className="h-10 w-10 text-brand-teal dark:text-brand-green" />
        </div>

        <h1 className="text-6xl font-black text-brand-teal dark:text-brand-green mb-2">
          404
        </h1>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          {t("Errors.notFoundTitle", { defaultValue: "Page not found" })}
        </h2>

        <p className="text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {t("Errors.notFoundDescription", {
            defaultValue:
              "The page you're looking for doesn't exist or has been moved.",
          })}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:shadow-xl hover:shadow-brand-teal/30 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            {t("Errors.goHome", { defaultValue: "Go Home" })}
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
          >
            <Brain className="h-4 w-4" />
            {t("Scanner.analyzeButton", {
              defaultValue: "Analyze Prescription",
            })}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
