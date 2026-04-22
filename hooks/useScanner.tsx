import React, { useState, useRef, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { MedicalReport } from '@/components/MedicalReport';
import type { AnalysisResult } from '@/lib/types/prescription';
import { useTranslations, useLocale } from 'next-intl';
import { ai, ROSHETTA_PROMPT, schema } from '@/lib/gemini';

export function useScanner() {
  const t = useTranslations();
  const locale = useLocale();

  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const analyzePrescription = async () => {
    if (!image) {
      setError(t('Errors.noImage'));
      return;
    }

    if (!ai) {
      setError(t('Errors.apiKeyMissing'));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setLoadingStep(0);

    const stepsLength = 4; // match loadingStepLabels length

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < stepsLength - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const base64Data = image.split(',')[1];
      
      const localizedPrompt = `${ROSHETTA_PROMPT}\n\nThe current locale is: ${locale}. Please provide descriptions and labels in the appropriate language.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: localizedPrompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
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

  return {
    image,
    analyzing,
    result,
    error,
    loadingStep,
    isGeneratingPDF,
    fileInputRef,
    handleUpload,
    removeImage,
    analyzePrescription,
    generatePDF,
    loadingStepLabels,
  };
}
