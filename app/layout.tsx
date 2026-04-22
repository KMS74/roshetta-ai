import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0D4C59",
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Roshetta.AI | روشتة.ذكاء",
  description:
    "AI Prescription Expert - Advanced digital pharmacist for decoding handwritten prescriptions.",
  keywords: [
    "AI",
    "Prescription",
    "Pharmacist",
    "Medical",
    "Health",
    "Roshetta",
    "Digital Pharmacist",
    "Handwritten Prescription",
    "Medication Analysis",
    "Drug Interactions",
    "Medication Reminders",
    "صيدلي ذكي",
    "روشتة",
    "تحليل روشتة",
    "تحليل وصفة طبية",
    "تحليل وصفة",
    "روشتة ذكية",
    "روشتة.ذكاء",
    "صيدلية",
    "صيدلي",
    "دواء",
    "تحليل",
    "ذكاء",
    "صحة",
    "طبي",
    "وصفة",
  ],
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
