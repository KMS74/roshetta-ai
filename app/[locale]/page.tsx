'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Download, 
  Calendar,
  AlertCircle,
  FlaskConical,
  Stethoscope,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Languages
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { MedicalReport } from '@/components/MedicalReport';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslations, useLocale } from 'next-intl';

import Image from 'next/image';

// Initialize Gemini moved to function for lazy loading to prevent crash when API key is missing

interface Medication {
  name: string;
  dosage: string;
  usage: string;
  tip: string;
  reminders: { time: string; label: string }[];
}

interface Interaction {
  severity: string;
  description: string;
}

interface AnalysisResult {
  medications: Medication[];
  interactions: Interaction[];
  disclaimer: string;
}

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';

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
      setError("Gemini API Key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your Secrets.");
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
      const time = isMounted ? new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US') : '';
      
      const labels = {
        reportTitle: t('Report.title'),
        reportSubtitle: t('Report.subtitle'),
        extractedMeds: t('Report.extractedMeds'),
        drugInteractions: t('Report.drugInteractions'),
        note: t('Report.note'),
        alert: t('Report.alert'),
        emergency: t('Report.severityHigh'),
        medium: t('Report.severityMedium'),
        low: t('Report.severityLow'),
        interactionDetected: t('Report.interactionDetected'),
        disclaimerTitle: t('Report.disclaimerTitle')
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

  const exportToCalendar = () => {
    if (!result) return;
    
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Roshetta.AI//Medication Reminders//EN\n";
    
    result.medications.forEach(med => {
      med.reminders.forEach(reminder => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = reminder.time.replace(/:/g, '') + "00";
        
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:Take ${med.name} - ${med.dosage}\n`;
        icsContent += `DTSTART;VALUE=DATE-TIME:${dateStr}T${timeStr}\n`;
        icsContent += `DTEND;VALUE=DATE-TIME:${dateStr}T${timeStr}\n`;
        icsContent += `RRULE:FREQ=DAILY\n`;
        icsContent += `DESCRIPTION:${med.usage}. Note: ${med.tip}\n`;
        icsContent += "END:VEVENT\n";
      });
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "medication_reminders.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir={isRtl ? 'rtl' : 'ltr'}>
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
            <span>AI-Driven Prescription Intelligence</span>
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
                      alt="Prescription" 
                      width={600} 
                      height={400} 
                      unoptimized 
                      className="h-[260px] w-full rounded-lg object-contain shadow-sm" 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                      aria-label="Remove Image"
                      className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm hover:bg-red-50 focus:ring-2 focus:ring-red-500"
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

          {/* Right Side: Results */}
          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              {!result && !analyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center text-center p-12 rounded-3xl bg-white/50 border-2 border-dashed border-slate-200"
                >
                  <div className="mb-6 rounded-full bg-slate-100 p-8">
                    <FileText className="h-16 w-16 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-400 capitalize">{t('Insights.medications')}</h3>
                  <p className="mt-2 text-slate-400 max-w-sm">{t('Scanner.heroSubtitle')}</p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-live="polite"
                  className="flex h-full flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl"
                >
                  <div className="relative mb-12">
                    <div className="h-24 w-24 animate-spin rounded-full border-4 border-slate-100 border-t-brand-teal" />
                    <div className="absolute inset-x-0 -bottom-8 flex justify-center">
                       <CheckCircle2 className={`h-6 w-6 transition-colors ${loadingStep >= 1 ? 'text-brand-green' : 'text-slate-200'}`} />
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {[
                        t('Loading.parsingImage'),
                        t('Loading.extractingText'),
                        t('Loading.checkingSafety'),
                        t('Loading.generatingInsights')
                      ][loadingStep]}
                    </h3>
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i <= loadingStep ? 'bg-brand-teal w-6' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
               {result && !analyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">{t('Insights.medications')}</h2>
                      <p className="text-slate-500 font-medium">{result.medications.length} items identified</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={generatePDF}
                        disabled={isGeneratingPDF}
                        aria-label={t('Insights.downloadPDF')}
                        className="flex h-11 px-5 items-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isGeneratingPDF ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        <span className="hidden sm:inline">{t('Insights.downloadPDF')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Medications Grid */}
                  <div className="grid gap-4">
                    {result.medications.map((med, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative overflow-hidden rounded-3xl bg-white p-1 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-500">
                                <Stethoscope className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-slate-900 mb-1">{med.name}</h3>
                                <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
                                  <Clock className="h-4 w-4" />
                                  {med.dosage}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {med.reminders.map((reminder, idx) => (
                                <div key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 border border-slate-100">
                                  {reminder.time}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                {med.usage}
                              </p>
                            </div>
                            
                            {med.tip && (
                              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-amber-900/70 italic leading-relaxed">
                                  {med.tip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Safety Section */}
                  <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${
                          result.interactions.length > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {result.interactions.length > 0 ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{t('Insights.interactions')}</h3>
                          <p className="text-sm font-medium text-slate-500">{t('Scanner.secureStorageDesc')}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {result.interactions.length > 0 ? (
                          result.interactions.map((interaction, i) => (
                            <div key={i} className={`p-6 rounded-3xl border-2 ${
                              interaction.severity === 'High' ? 'bg-red-50/50 border-red-100 text-red-900' : 
                              interaction.severity === 'Medium' ? 'bg-amber-50/50 border-amber-100 text-amber-900' : 
                              'bg-blue-50/50 border-blue-100 text-blue-900'
                            }`}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                  interaction.severity === 'High' ? 'bg-red-500' : interaction.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                                  {interaction.severity} Severity
                                </span>
                              </div>
                              <p className="text-sm font-bold leading-relaxed">{interaction.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <div className="h-16 w-16 mb-4 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                              <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('Insights.noInteractions')}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50/30 border border-red-100/50">
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs font-bold leading-relaxed text-red-900/60 transition-colors">
                            <strong>{t('Report.disclaimerTitle')}:</strong> {result.disclaimer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={exportToCalendar}
                      className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-teal transition-colors tracking-widest uppercase"
                    >
                      <Calendar className="h-4 w-4" />
                      {t('Insights.exportCalendar')}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
