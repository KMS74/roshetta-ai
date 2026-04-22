import React from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';

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
        className={`group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl text-lg font-bold transition-all focus:ring-4 focus:ring-brand-teal/20 focus:outline-none ${
          analyzing 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
            : !image 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed' 
              : 'bg-linear-to-r from-brand-teal-dark to-brand-teal dark:from-brand-green-dark dark:to-brand-green text-white shadow-xl shadow-brand-teal/20 dark:shadow-brand-green/20 hover:scale-[1.02] active:scale-98'
        }`}
      >
        {/* Shine effect on hover */}
        {!analyzing && image && (
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        )}

        {analyzing ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 dark:border-slate-600 border-t-brand-teal dark:border-t-brand-green" />
            <span className="animate-pulse">{t('Scanner.analyzing')}</span>
          </>
        ) : (
          <>
            <Wand2 className="h-6 w-6 transition-transform group-hover:rotate-12" />
            <span>{t('Scanner.analyzeButton')}</span>
          </>
        )}
      </button>
 
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="flex items-center gap-2 overflow-hidden rounded-xl bg-red-50 dark:bg-red-900/10 p-4 text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
