import type { Metadata } from 'next';
import { Cairo, Outfit } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-google-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Roshetta.AI | روشتة.ذكاء',
  description: 'AI Prescription Expert - Advanced digital pharmacist for decoding handwritten prescriptions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
