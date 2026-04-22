import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <div className="mb-16 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 px-4 py-1.5 text-xs font-bold text-brand-teal dark:text-brand-green mb-6 border border-brand-teal/20"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{t("Scanner.heroPill")}</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold tracking-tight lg:text-7xl text-slate-900 dark:text-white leading-[1.1]"
      >
        {t("Scanner.heroTitle")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
      >
        {t("Scanner.heroSubtitle")}
      </motion.p>
    </div>
  );
};
