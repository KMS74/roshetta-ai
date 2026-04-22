"use client";

import { ResultsPanel } from "@/components/results/ResultsPanel";
import { useScanner } from "@/hooks/useScanner";
import { motion } from "motion/react";

import { HeroSection } from "@/components/home/HeroSection";
import { ScannerActions } from "@/components/home/ScannerActions";
import { ScannerBadges } from "@/components/home/ScannerBadges";
import { ScannerUploader } from "@/components/home/ScannerUploader";

export default function Home() {
  const {
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
  } = useScanner();

  return (
    <main role="main" className="container mx-auto px-4 py-8 md:py-12 lg:px-8 lg:py-20">
      <HeroSection />

      <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:items-start max-w-7xl mx-auto">
        {/* Left Side: Scanner */}
        <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 shadow-xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800"
          >
            <ScannerUploader
              image={image}
              fileInputRef={fileInputRef}
              cameraInputRef={cameraInputRef}
              onUpload={handleUpload}
              onRemove={removeImage}
            />

            <ScannerActions
              image={image}
              analyzing={analyzing}
              error={error}
              onAnalyze={analyzePrescription}
            />

            <ScannerBadges />
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
  );
}
