import React, { useState, useRef, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { MedicalReport } from '@/components/MedicalReport';
import type { AnalysisResult } from '@/lib/types/prescription';
import { useTranslations, useLocale } from 'next-intl';
import { saveScan, getHistory, deleteScan, clearHistory } from '@/lib/scan-history';
import type { ScanHistoryEntry } from '@/lib/scan-history';
import { trackEvent } from '@/lib/analytics';
import { useHistory } from '@/context/HistoryContext';
import { useEffect } from 'react';

export function useScanner() {
  const t = useTranslations();
  const locale = useLocale();
  const { 
    registerRestoreHandler, 
    refreshHistory: refreshGlobalHistory,
    pendingRestoreEntry,
    setPendingRestoreEntry
  } = useHistory();

  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const restoreScan = useCallback((entry: ScanHistoryEntry) => {
    setResult(entry.result);
    setImage(entry.thumbnail || null);
    setError(null);
    trackEvent('scan_restored');
  }, []);

  useEffect(() => {
    registerRestoreHandler(restoreScan);
  }, [registerRestoreHandler, restoreScan]);

  // ── Handle cross-page restores ────────────────────────────────────────
  useEffect(() => {
    if (pendingRestoreEntry) {
      // Defer to next tick to avoid cascading render warning
      const timer = setTimeout(() => {
        restoreScan(pendingRestoreEntry);
        setPendingRestoreEntry(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pendingRestoreEntry, restoreScan, setPendingRestoreEntry]);

  // ── Image Upload ──────────────────────────────────────────────────────
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

  const removeImage = () => {
    setImage(null);
    setResult(null);
  };

  // ── Analyze via Server API Route ──────────────────────────────────────
  const analyzePrescription = async () => {
    if (!image) {
      setError(t('Errors.noImage'));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setLoadingStep(0);
    trackEvent('scan_started');

    const stepsLength = 4; // match loadingStepLabels length

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < stepsLength - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, locale }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);

        if (response.status === 429) {
          setError(t('Errors.rateLimited', { defaultValue: 'Too many requests. Please wait a moment and try again.' }));
          return;
        }

        setError(errBody?.error || t('Errors.analysisFailed'));
        return;
      }

      const parsed: AnalysisResult = await response.json();
      setResult(parsed);
      trackEvent('scan_completed', { medicationCount: String(parsed.medications?.length || 0) });

      // Save to history
      if (image) {
        await saveScan(parsed, image);
        refreshGlobalHistory();
      }
    } catch (err) {
      console.error(err);
      trackEvent('scan_failed');

      // Distinguish network errors from other failures
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(t('Errors.networkError', { defaultValue: 'Network error. Please check your internet connection and try again.' }));
      } else {
        setError(t('Errors.analysisFailed'));
      }
    } finally {
      clearInterval(stepInterval);
      setAnalyzing(false);
    }
  };

  // ── PDF Export ────────────────────────────────────────────────────────
  const generatePDF = async () => {
    if (!result) return;
    setIsGeneratingPDF(true);
    try {
      const date = new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US');
      const timeTag = locale === 'ar' ? 'ar-EG' : 'en-US';
      const time = new Date().toLocaleTimeString(timeTag, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
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
        summaryLabel: t('Report.summaryLabel'),
        pricingSection: t('Report.pricingSection'),
        estimatedPriceLabel: t('Report.estimatedPriceLabel'),
        alternativesLabel: t('Report.alternativesLabel'),
        pricingDisclaimer: t('Report.pricingDisclaimer'),
      };

      const blob = await pdf(
        <MedicalReport 
          summary={result.summary}
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

  return {
    image,
    analyzing,
    result,
    error,
    loadingStep,
    isGeneratingPDF,
    fileInputRef,
    cameraInputRef,
    handleUpload,
    removeImage,
    analyzePrescription,
    generatePDF,
    loadingStepLabels,
    restoreScan,
  };
}
