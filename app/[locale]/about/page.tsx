'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import { Info, ShieldCheck, Zap, HeartPulse } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations();

  const features = [
    { icon: Zap, title: t('Scanner.aiPowered'), desc: t('Scanner.aiPoweredDesc') },
    { icon: ShieldCheck, title: t('Scanner.secureStorage'), desc: t('Scanner.secureStorageDesc') },
    { icon: HeartPulse, title: t('Scanner.heroTitle'), desc: t('Scanner.heroSubtitle') }
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col transition-colors duration-500">
      <Header />
      
      <main role="main" className="flex-grow container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-teal/10 dark:bg-brand-teal/20 rounded-2xl text-brand-teal dark:text-brand-green">
              <Info className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('Navigation.about')}</h1>
          </div>

          <div className="prose prose-slate lg:prose-xl">
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
              {t('Scanner.heroSubtitle')}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {features.map((feature, i) => (
                <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                  <feature.icon className="h-10 w-10 text-brand-teal dark:text-brand-green mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
