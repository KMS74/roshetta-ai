import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ScannerBadges = () => {
  const t = useTranslations();

  return (
    <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4">
      <div className="flex flex-col gap-1 rounded-2xl bg-brand-teal-light/10 dark:bg-brand-teal-light/20 p-3 md:p-4 border border-brand-teal/10">
        <div className="flex items-center gap-2 text-brand-teal dark:text-brand-green font-bold text-sm">
          <Cpu className="h-4 w-4" />
          {t('Scanner.aiPowered')}
        </div>
        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-tight">
          {t('Scanner.aiPoweredDesc')}
        </p>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-brand-green-light/10 dark:bg-brand-green/20 p-3 md:p-4 border border-brand-green/10">
        <div className="flex items-center gap-2 text-brand-green-dark dark:text-brand-green-light font-bold text-sm">
          <ShieldCheck className="h-4 w-4" />
          {t('Scanner.secureStorage')}
        </div>
        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-tight">
          {t('Scanner.secureStorageDesc')}
        </p>
      </div>
    </div>
  );
};
