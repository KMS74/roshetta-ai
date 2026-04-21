"use client";

import React from "react";
import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations();

  return (
    <footer role="contentinfo" className="border-t bg-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-brand-teal" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {t("Common.brandName")}
            </span>
          </div>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap justify-center gap-8"
          >
            <Link
              href="/privacy"
              className="text-sm font-medium text-slate-500 hover:text-brand-teal transition-colors"
            >
              {t("Navigation.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-slate-500 hover:text-brand-teal transition-colors"
            >
              {t("Navigation.terms")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-500 hover:text-brand-teal transition-colors"
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
