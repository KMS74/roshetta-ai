# 🩺 Roshetta.AI (روشتة.ذكاء)

**The AI Prescription Expert** – *Decoding Handwritten Prescriptions with Precision.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-vibrant?logo=google-gemini)](https://aistudio.google.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🚀 Overview

Roshetta.AI is a state-of-the-art AI-powered platform designed to bridge the gap between complex medical handwriting and patient understanding. Leveraging **Google's Gemini 1.5 Flash Vision** model, it instantly translates handwritten prescriptions into clear, structured, and actionable medical summaries.

### 🌐 [Visit App (Live)](https://roshetta.ai)

---

## ✨ Key Features

- 🔍 **AI-Powered OCR**: Advanced vision recognition specialized for handwritten medical prescriptions.
- 💊 **Medication Intelligence**: Automatically extracts drug names, dosages, frequencies, and administration routes.
- ⚠️ **Drug Interaction Detection**: Intelligent analysis to identify potential interactions and safety warnings.
- 📄 **Professional PDF Reports**: Generate and download detailed medical summaries for your records.
- 📤 **Smart Results Sharing**: Easily share analysis results via WhatsApp or other platforms.
- 🌍 **Fully Bilingual**: Native support for English and Arabic with seamless RTL/LTR layout transitions.
- 💾 **Scan History**: Securely save, retrieve, and manage your previous prescription scans.
- 🌓 **Premium Adaptive UI**: Fluid dark and light mode experience with smooth micro-animations.
- 📱 **PWA Ready**: Installable on mobile devices for a native app-like experience.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Motion](https://motion.dev/) |
| **AI Vision** | [Google Gemini 1.5 Flash](https://aistudio.google.com/) |
| **Backend/DB** | [Supabase](https://supabase.com/) |
| **PDF Engine** | [React-PDF](https://react-pdf.org/) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **Package Manager**: npm or yarn
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)
- **Supabase Account**: (Optional) For history and feedback persistence

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/roshetta.ai.git
   cd roshetta.ai
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI Configuration
   NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_key"
   GEMINI_API_KEY="your_gemini_key"

   # Supabase Configuration (Optional)
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 📁 Project Structure

```text
├── app/             # Next.js App Router (Locale-aware routing)
├── components/      # UI Components (Home, Results, Shared, etc.)
├── context/         # React Context Providers (History, etc.)
├── hooks/           # Custom React Hooks (Scanner logic)
├── i18n/            # Internationalization configuration
├── lib/             # Core utilities (Gemini, Supabase, Analytics)
├── messages/        # Translation dictionaries (EN/AR)
├── public/          # Static assets, icons, and PWA manifest
└── styles/          # Global CSS and Tailwind configuration
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for better healthcare accessibility
</p>
