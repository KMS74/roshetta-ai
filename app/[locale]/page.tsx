'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  ShieldCheck,
  Zap,
  AlertCircle,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { pdf } from '@react-pdf/renderer';
import { MedicalReport } from '@/components/MedicalReport';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ResultsPanel } from '@/components/results/ResultsPanel';
import type { AnalysisResult } from '@/lib/types/prescription';
import { useTranslations, useLocale } from 'next-intl';

import Image from 'next/image';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // setIsMounted is used as a workaround for hydration mismatch with date/time
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError(t('Errors.fileTooLarge'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePrescription = async () => {
    if (!image) {
      setError(t('Errors.noImage'));
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setError(t('Errors.apiKeyMissing'));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setLoadingStep(0);

    const steps = [
      t('Loading.parsingImage'),
      t('Loading.extractingText'),
      t('Loading.checkingSafety'),
      t('Loading.generatingInsights')
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const base64Data = image.split(',')[1];
      
      const prompt = `
        You are an expert Egyptian pharmacist assistant. Analyze this prescription image.
        Extract:
        1. Medication name.
        2. Dosage instructions (translated to clear, simple Egyptian Arabic if locale is 'ar', or simple English if 'en').
        3. Simple usage description.
        4. A helpful pharmacist tip.
        5. Suggested reminder times in HH:MM format.
        6. Drug-to-drug interactions if multiple meds exist.
        
        Return ONLY valid JSON in this format:
        {
          "medications": [
            { "name": "", "dosage": "", "usage": "", "tip": "", "reminders": [{ "time": "08:00", "label": "Morning dose" }] }
          ],
          "interactions": [
            { "severity": "High/Medium/Low", "description": "" }
          ],
          "disclaimer": "AI estimation, consult a pharmacist."
        }
        
        The current locale is: ${locale}. Please provide descriptions and labels in the appropriate language.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      });

      const text = response.text || '';
      const cleanedText = text.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(t('Errors.analysisFailed'));
    } finally {
      clearInterval(stepInterval);
      setAnalyzing(false);
    }
  };

  const generatePDF = async () => {
    if (!result) return;
    setIsGeneratingPDF(true);
    try {
      const date = isMounted ? new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '';
      const timeTag = locale === 'ar' ? 'ar-EG' : 'en-US';
      const time = isMounted
        ? new Date().toLocaleTimeString(timeTag, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : '';
      
      const labels = {
        reportTitle: t('Report.title'),
        reportSubtitle: t('Report.subtitle'),
        extractedMeds: t('Report.extractedMeds'),
        drugInteractions: t('Report.drugInteractions'),
        disclaimerTitle: t('Report.disclaimerTitle'),
        dateLabel: t('Report.dateLabel'),
        timeLabel: t('Report.timeLabel'),
        footerTagline: t('Report.footerTagline'),
        typicalUse: t('Insights.typicalUse'),
        safetyTip: t('Insights.safetyTip'),
        remindersHeading: t('Insights.remindersHeading'),
        severityDisplayHigh: t('Insights.severityDisplayHigh'),
        severityDisplayMedium: t('Insights.severityDisplayMedium'),
        severityDisplayLow: t('Insights.severityDisplayLow'),
      };

      const blob = await pdf(
        <MedicalReport 
          medications={result.medications}
          interactions={result.interactions}
          disclaimer={result.disclaimer}
          date={date}
          time={time}
          locale={locale}
          labels={labels}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Roshetta_AI_Report_${date.replace(/\//g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(t('Errors.exportFailed'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const loadingStepLabels = [
    t('Loading.parsingImage'),
    t('Loading.extractingText'),
    t('Loading.checkingSafety'),
    t('Loading.generatingInsights'),
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main role="main" className="container mx-auto px-4 py-12 lg:px-8 lg:py-20">
        {/* Hero Section - Now Span Full Width */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-1.5 text-xs font-bold text-brand-teal mb-6 border border-brand-teal/20"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t('Scanner.heroPill')}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight lg:text-7xl text-slate-900 leading-[1.1]"
          >
            {t('Scanner.heroTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 leading-relaxed"
          >
            {t('Scanner.heroSubtitle')}
          </motion.p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start max-w-7xl mx-auto">
          {/* Left Side: Scanner */}
          <div className="flex flex-col gap-10">
            {/* Upload Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-slate-200 border border-slate-100"
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label={t('Scanner.uploadTitle')}
                className={`relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 focus:ring-2 focus:ring-brand-teal focus:outline-none ${
                  image ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-200 bg-slate-50 hover:border-brand-teal hover:bg-slate-100'
                }`}
              >
                {image ? (
                  <div className="relative h-full w-full p-4">
                    <Image
                      src={image}
                      alt={t('Scanner.prescriptionImageAlt')}
                      width={600} 
                      height={400} 
                      unoptimized 
                      className="h-[260px] w-full rounded-lg object-contain shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                      aria-label={t('Scanner.removeImage')}
                      className="absolute top-6 end-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm hover:bg-red-50 focus:ring-2 focus:ring-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                      <Upload className="h-10 w-10" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">{t('Scanner.uploadTitle')}</h3>
                    <p className="text-sm text-slate-500">{t('Scanner.uploadSubtitle')}</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleUpload} 
                  accept="image/*"
                  capture="environment" 
                  className="hidden" 
                  aria-hidden="true"
                />
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <button
                  disabled={!image || analyzing}
                  onClick={analyzePrescription}
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

              {/* Bento Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 rounded-2xl bg-brand-teal-light/30 p-4 border border-brand-teal/10">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
                    <Zap className="h-4 w-4" />
                    {t('Scanner.aiPowered')}
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">{t('Scanner.aiPoweredDesc')}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl bg-brand-green-light/30 p-4 border border-brand-green/10">
                  <div className="flex items-center gap-2 text-brand-green-dark font-bold text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    {t('Scanner.secureStorage')}
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">{t('Scanner.secureStorageDesc')}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <ResultsPanel
            analyzing={analyzing}
            result={result}
            loadingStep={loadingStep}
            loadingStepLabels={loadingStepLabels}
            onDownloadPdf={generatePDF}
            isGeneratingPdf={isGeneratingPDF}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
