"use client";

import React from "react";
import { Brain } from "lucide-react";
import { useTranslations } from "next-intl";

type BrandLogoProps = {
  className?: string;
  iconSize?: number;
  textSize?: string;
};

export function BrandLogo({
  className = "",
  iconSize = 24,
  textSize = "text-2xl",
}: BrandLogoProps) {
  const t = useTranslations();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="rounded-xl bg-brand-teal p-2 shadow-lg shadow-brand-teal/20 flex-shrink-0">
        <Brain
          style={{ width: iconSize, height: iconSize }}
          className="text-white"
        />
      </div>
      <span
        className={`${textSize} font-black hidden lg:block tracking-tight text-slate-900 dark:text-white`}
      >
        {t("Common.brandName")}
      </span>
    </div>
  );
}
