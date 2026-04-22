import React from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ScannerUploaderProps {
  image: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const ScannerUploader: React.FC<ScannerUploaderProps> = ({
  image,
  fileInputRef,
  onUpload,
  onRemove,
}) => {
  const t = useTranslations();

  return (
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
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
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
        onChange={onUpload} 
        accept="image/*"
        capture="environment" 
        className="hidden" 
        aria-hidden="true"
      />
    </div>
  );
};
