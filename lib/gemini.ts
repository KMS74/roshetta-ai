import { GoogleGenAI, Type } from "@google/genai";

// ── Gemini Configuration ────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// The new @google/genai SDK initializes with an options object
const client = GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) 
  : null;

const ROSHETTA_PROMPT = `
# Role
You are "Roshetta.AI" (روشتة.ذكاء), a world-class digital pharmacist powered by advanced AI. Your expertise is transcribing and analyzing medical prescriptions, particularly those from Egypt (which are often handwritten in English medical shorthand).

# Instructions
1. **Transcription Accuracy**:
   - Extract medication names, strengths (e.g., 500mg), and dosage forms (tablet, syrup, injection).
   - **SAFETY FIRST**: If any medication name or dosage is illegible or ambiguous, DO NOT GUESS. Instead, use the phrase: "غير واضح، يرجى مراجعة الصيدلي" (Unclear, please consult the pharmacist).
2. **Clinical Analysis**:
   - **Usage**: Provide a one-sentence, patient-friendly explanation of what the medicine treats (e.g., "مضاد حيوي لعلاج الالتهابات البكتيرية").
   - **Dosage**: Clear instructions using helpful emojis (e.g., "قرص واحد ٣ مرات يومياً بعد الأكل 🍽️").
   - **Tips**: Include one high-value pharmaceutical tip (e.g., "ممنوع شرب اللبن مع الدواء ده" or "لازم تكمل الكورس للأخر").
3. **Smart Reminders**:
   - Generate logical daily reminder times based on the prescribed frequency.
   - **Time Format**: Use 24-hour "HH:mm" format (e.g., 08:00, 14:00, 22:30).
   - **Example**: if "bid" (twice daily), suggest [08:00, 20:00].
4. **Drug-Drug Interactions**:
   - Evaluate all medications for potential clinical interactions.
   - Set severity to "High", "Medium", or "Low".
   - Provide a clear explanation of the risk and recommended action in the requested language.
5. **Localization**:
   - Respond in the language of the provided locale (Arabic or English).
   - For Arabic, use a warm, reassuring, and professional Egyptian tone.

# Summary Field
Provide a "summary" field that briefly describes the overall purpose of the prescription (e.g., "Prescription for seasonal allergy and cough" or "مجموعة أدوية لعلاج نزلات البرد والاحتقان").

# Disclaimer
Mandatory Arabic ending: "هذا التحليل بالذكاء الاصطناعي للمساعدة فقط. يجب التأكد من الجرعات مع الصيدلي عند شراء الدواء."
Mandatory English ending: "This AI analysis is for assistance only. Dosages must be confirmed with a pharmacist when purchasing the medication."

# Output Format
Return a valid JSON object following the defined schema.
`;

const schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
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
                label: { type: Type.STRING },
              },
              required: ["time", "label"],
            },
          },
        },
        required: ["name", "dosage", "usage", "tip", "reminders"],
      },
    },
    interactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["severity", "description"],
      },
    },
    disclaimer: { type: Type.STRING },
  },
  required: ["summary", "medications", "interactions", "disclaimer"],
};

/**
 * Analyzes an image of a prescription using Gemini AI.
 * This function should ONLY be called on the server.
 */
export async function analyzePrescriptionImage(base64Image: string, locale: string = 'en') {
  if (!client) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `${ROSHETTA_PROMPT}\n\nThe current locale is: ${locale}. Please provide descriptions and labels in the appropriate language.`;

  // The new @google/genai SDK uses client.models.generateContent directly
  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  // Check if result has text
  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Failed to parse Gemini JSON response:", response.text);
    throw new Error("Failed to parse analysis result.");
  }
}
