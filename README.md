

# Roshetta.AI (روشتة.ذكاء)

**The AI Prescription Expert - Your advanced digital pharmacist for decoding handwritten prescriptions instantly.**

Roshetta.AI is an AI-powered web application that helps patients and pharmacists read and understand handwritten medical prescriptions. Built with Next.js, Google's Gemini API, and Tailwind CSS, it offers a fast, accessible, and intuitive way to improve patient safety.

## 🌟 Key Features

- **AI OCR & Image Processing**: Instantly decodes complex handwritten prescriptions using Gemini's powerful vision models.
- **Pharma Intelligence**: Provides detailed information on medications, dosages, and instructions.
- **Patient Safety**: Helps avoid medication errors by ensuring patients understand their prescriptions correctly.
- **Bilingual Support**: Fully supports both Arabic and English.
- **Progressive Web App (PWA)**: Installable on mobile devices for quick access on the go.

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI Model:** [Google Gemini API](https://aistudio.google.com/) (`@google/genai`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Internationalization:** `next-intl`
- **PWA Integration:** `@ducanh2912/next-pwa`

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd roshetta.ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Gemini API keys:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY="your_api_key_here"
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 PWA Features

This app is configured as a Progressive Web App. When accessed on a mobile device, users will be prompted to install the app to their home screen for a native-like experience.

## 🌍 Internationalization

Roshetta.AI supports multiple languages (English and Arabic). Translation files are located in the `messages/` directory. The app uses `next-intl` to manage locale routing and translations automatically.

## 📄 License

This project is licensed under the MIT License.
