"use client";

import React from "react";
import { Brain, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations();

  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-bg py-8 md:py-12 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-teal p-2 shadow-lg shadow-brand-teal/20">
              <Brain className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("Common.brandName")}
            </span>
          </div>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
          >
            <Link
              href="/privacy"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
            >
              {t("Navigation.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
            >
              {t("Navigation.terms")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-green transition-colors"
            >
              {t("Navigation.about")}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} {t("Common.brandName")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
