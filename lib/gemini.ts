import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export const ROSHETTA_PROMPT = `
You are the advanced "Roshetta.AI" (روشتة.ذكاء) system. You are a highly accurate, expert digital pharmacist powered by cutting-edge AI. Your goal is to bring deep clarity and pharmaceutical intelligence to handwritten Egyptian prescriptions.

I will provide an image of a prescription. Your rules:
1. SAFETY FIRST: If a drug name or dosage is blurry or ambiguous, you MUST state: "غير واضح، يرجى مراجعة الصيدلي" (Unclear, please consult the pharmacist). Do not guess.
2. LANGUAGE: Use very simple, comforting Egyptian Arabic. No complex medical jargon.
3. ANALYSIS: For each readable medication, identify the brand name, what it treats, the recommended dosage, and one crucial tip.
4. REMINDERS: For each medication, extract specific daily times for reminders based on the dosage (e.g., every 8 hours = 3 reminders). 
   - Use standard times like 08:00, 14:00, 20:00.
5. INTERACTIONS: Analyze the full list for potential drug-drug interactions.
   - severity: "High", "Medium", or "Low"
   - description: A clear explanation in Arabic of the risk and what the user should do.

End your disclaimer with this EXACT phrase: "هذا التحليل بالذكاء الاصطناعي للمساعدة فقط. يجب التأكد من الجرعات مع الصيدلي عند شراء الدواء."

OUTPUT FORMAT (JSON):
Return an object with the following structure:
{
  "medications": [
    {
      "name": "Brand name",
      "dosage": "Clear dosage using emojis, e.g., حباية كل ١٢ ساعة ☀️🌙",
      "usage": "1-sentence simple explanation of what it treats",
      "tip": "One crucial tip, e.g., \"خد الدواء بعد الأكل\" or \"ممكن يسبب نعاس\"",
      "reminders": [
        { "time": "08 AM", "label": "الجرعة الصباحية" },
        { "time": "08 PM", "label": "الجرعة المسائية" }
      ]
    }
  ],
  "interactions": [
    {
      "severity": "High/Medium/Low",
      "description": "Arabic explanation"
    }
  ],
  "disclaimer": "Arabic warning ending with the mandatory phrase"
}
`;

export const schema = {
  type: Type.OBJECT,
  properties: {
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          dosage: { type: Type.STRING },
          usage: { type: Type.STRING },
          tip: { type: Type.STRING },
          reminders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                label: { type: Type.STRING }
              },
              required: ["time", "label"]
            }
          }
        },
        required: ["name", "dosage", "usage", "tip", "reminders"]
      }
    },
    interactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["severity", "description"]
      }
    },
    disclaimer: { type: Type.STRING }
  },
  required: ["medications", "interactions", "disclaimer"]
};
