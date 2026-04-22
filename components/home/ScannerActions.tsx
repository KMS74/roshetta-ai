import React from 'react';
import { FlaskConical, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ScannerActionsProps {
  image: string | null;
  analyzing: boolean;
  error: string | null;
  onAnalyze: () => void;
}

export const ScannerActions: React.FC<ScannerActionsProps> = ({
  image,
  analyzing,
  error,
  onAnalyze,
}) => {
  const t = useTranslations();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <button
        disabled={!image || analyzing}
        onClick={onAnalyze}
        aria-label={analyzing ? t('Scanner.analyzing') : t('Scanner.analyzeButton')}
        className={`flex h-16 w-full items-center justify-center gap-3 rounded-2xl text-lg font-bold transition-all focus:ring-4 focus:ring-brand-teal/20 focus:outline-none ${
          analyzing 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : !image 
              ? 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed' 
              : 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {analyzing ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-brand-teal" />
            {t('Scanner.analyzing')}
          </>
        ) : (
          <>
            <FlaskConical className="h-6 w-6" />
            {t('Scanner.analyzeButton')}
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};
