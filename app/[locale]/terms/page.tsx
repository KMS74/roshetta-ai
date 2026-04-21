'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main role="main" className="flex-grow container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-teal/10 rounded-2xl text-brand-teal">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900">{t('Navigation.terms')}</h1>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms of Use</h2>
            <p className="text-slate-600 mb-8">{t('Insights.reportDisclaimer')}</p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Use of Service</h3>
            <p className="text-slate-600 leading-relaxed">
              This service is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Accuracy of Information</h3>
            <p className="text-slate-600 leading-relaxed">
              While we strive for accuracy, the extraction of medical data from handwritten text is inherently complex and may contain errors. Always verify information with a medical professional.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
