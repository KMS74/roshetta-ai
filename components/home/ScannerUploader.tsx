import React from "react";
import Image from "next/image";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ScannerUploaderProps {
  image: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const ScannerUploader: React.FC<ScannerUploaderProps> = ({
  image,
  fileInputRef,
  cameraInputRef,
  onUpload,
  onRemove,
}) => {
  const t = useTranslations();

  return (
    <div
      className={`relative flex min-h-[360px] flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-500 ${
        image
          ? "border-brand-teal bg-brand-teal/5 dark:bg-brand-teal/10"
          : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-teal/50"
      }`}
    >
      {image ? (
        <div className="relative h-full w-full p-4 animate-in fade-in zoom-in duration-300">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700">
            <Image
              src={image}
              alt={t("Scanner.prescriptionImageAlt")}
              width={600}
              height={400}
              unoptimized
              className="h-[280px] w-full object-contain bg-white dark:bg-slate-900"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={t("Scanner.removeImage")}
            className="absolute -top-2 -end-2 flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-red-500 shadow-2xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 active:scale-95 z-10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center p-8 text-center">
          <div className="mb-8 relative">
            <div className="absolute -inset-4 rounded-full bg-brand-teal/20 dark:bg-brand-teal/30 blur-xl animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-brand-teal/20 to-brand-teal/5 dark:from-brand-teal/30 dark:to-brand-teal/10 text-brand-teal shadow-inner">
              <Camera className="h-10 w-10" />
            </div>
          </div>
          
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("Scanner.uploadTitle")}
          </h3>
          <p className="mb-10 max-w-[240px] text-sm text-slate-500 dark:text-slate-400">
            {t("Scanner.uploadSubtitle")}
          </p>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-3 rounded-2xl bg-brand-teal px-6 py-4 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal-dark hover:scale-[1.02] active:scale-95"
            >
              <Camera className="h-5 w-5" />
              {t("Scanner.takePhoto")}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white dark:bg-slate-800 px-6 py-4 font-bold text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-95"
            >
              <ImageIcon className="h-5 w-5" />
              {t("Scanner.uploadFile")}
            </button>
          </div>
        </div>
      )}

      {/* Hidden inputs for different capture modes */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={onUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};
