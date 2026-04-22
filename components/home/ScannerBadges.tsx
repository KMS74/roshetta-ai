import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ScannerBadges = () => {
  const t = useTranslations();

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1 rounded-2xl bg-brand-teal-light/30 p-4 border border-brand-teal/10">
        <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
          <Zap className="h-4 w-4" />
          {t('Scanner.aiPowered')}
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-tight">
          {t('Scanner.aiPoweredDesc')}
        </p>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-brand-green-light/30 p-4 border border-brand-green/10">
        <div className="flex items-center gap-2 text-brand-green-dark font-bold text-sm">
          <ShieldCheck className="h-4 w-4" />
          {t('Scanner.secureStorage')}
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-tight">
          {t('Scanner.secureStorageDesc')}
        </p>
      </div>
    </div>
  );
};
