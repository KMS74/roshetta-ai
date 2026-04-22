"use client";

import { motion } from "motion/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { useScanner } from "@/hooks/useScanner";

import { HeroSection } from "@/components/home/HeroSection";
import { ScannerUploader } from "@/components/home/ScannerUploader";
import { ScannerActions } from "@/components/home/ScannerActions";
import { ScannerBadges } from "@/components/home/ScannerBadges";

export default function Home() {
  const {
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
  } = useScanner();

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 transition-colors duration-300">
      <Header />

      <main
        role="main"
        className="container mx-auto px-4 py-12 lg:px-8 lg:py-20"
      >
        <HeroSection />

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start max-w-7xl mx-auto">
          {/* Left Side: Scanner */}
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800"
            >
              <ScannerUploader
                image={image}
                fileInputRef={fileInputRef}
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

      <Footer />
    </div>
  );
}
