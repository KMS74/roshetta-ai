'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  const t = useTranslations();

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
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('Navigation.privacy')}</h1>
          </div>
 
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-800 prose prose-slate dark:prose-invert max-w-none transition-colors">
            <p className="text-slate-600 dark:text-slate-300 mb-8">{t('Scanner.secureStorageDesc')}</p>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Privacy Matters</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At Roshetta.AI, we use state-of-the-art encryption and processing techniques to ensure your medical data is handled with the highest level of security. 
              We do not store your prescription images or personal medical data on our servers after processing is complete.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Data Collection</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We only collect the data necessary to provide the service. This includes the image you upload for transient processing by the Gemini AI engine.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
