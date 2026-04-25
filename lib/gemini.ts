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
5. **Medication Pricing (Egyptian Market)**:
    - Provide an **approximate price** (as of your knowledge cutoff or available data) for medications in Egypt.
    - **Disclaimer**: In the root 'disclaimer' field, you MUST include a note that "Prices are estimates and may not reflect current market rates" in the appropriate language, along with the mandatory medical disclaimer.
    - **Accuracy**: If real-time accuracy is required, the system should ideally call an external pricing API. If you cannot determine a price with reasonable confidence, you MUST omit the \`estimatedPrice\` field or set it to null.
    - **Format**: \`estimatedPrice\` must be an object: \`{ "price": number, "currency": "EGP" }\`.
    - **Example**: \`estimatedPrice: { "price": 97, "currency": "EGP" }\`. Be precise with concentrations and pack sizes.
    - Always set currency to "EGP".
6. **Egyptian Alternatives (IMPORTANT — Always provide when available)**:
    - For EVERY imported or branded medication, you MUST suggest up to 3 locally manufactured Egyptian generic alternatives. This is a critical feature for Egyptian patients who need affordable options.
    - **Always search your knowledge** for Egyptian-made generics with the same active ingredient and strength.
    - For each alternative provide:
        - **name**: The exact Egyptian brand name (e.g., "Hibiotic" instead of "Augmentin", "Cetal" instead of "Panadol", "Antinal" instead of "Ercefuryl").
        - **manufacturer**: The Egyptian pharmaceutical company (e.g., "Amoun Pharmaceutical", "EIPICO", "Pharco", "EVA Pharma", "Sedico", "GlaxoSmithKline Egypt", "Medical Union Pharmaceuticals", "Memphis Pharma", "Kahira Pharma", "Delta Pharma", "Nile Pharma", "Marcyrl Pharma").
        - **estimatedPrice**: An object with the approximate \`price\` (number) and \`currency\` ("EGP") for this alternative. Omit if uncertain.
        - **note**: Clearly state the active ingredient match (e.g., "نفس المادة الفعالة: أموكسيسيللين + كلافيولانيك أسيد 1 جم" or "Same active ingredient: Amoxicillin/Clavulanate 1g").
    - If the medication IS already a local Egyptian product, include one entry with the same name and note: "هذا منتج مصري محلي بالفعل" / "This is already a local Egyptian product".
    - Only return an empty array if there genuinely are no Egyptian-made alternatives (very rare for common medications).
    - **Prioritize the cheapest alternatives first** in the array.
7. **Localization**:
    - Respond in the language of the provided locale (Arabic or English).
    - For Arabic, use a warm, reassuring, and professional Egyptian tone.

# Summary Field
Provide a "summary" field that briefly describes the overall purpose of the prescription.

# Disclaimer Field
In the "disclaimer" field of the JSON:
- Mandatory Arabic: "هذا التحليل بالذكاء الاصطناعي للمساعدة فقط. يجب التأكد من الجرعات مع الصيدلي عند شراء الدواء. الأسعار استرشادية وقد لا تعكس أسعار السوق الحالية."
- Mandatory English: "This AI analysis is for assistance only. Dosages must be confirmed with a pharmacist. Prices are estimates and may not reflect current market rates."

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
          estimatedPrice: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER },
              currency: { type: Type.STRING },
            },
            required: ["price", "currency"],
            nullable: true,
          },
          egyptianAlternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                manufacturer: { type: Type.STRING },
                estimatedPrice: {
                  type: Type.OBJECT,
                  properties: {
                    price: { type: Type.NUMBER },
                    currency: { type: Type.STRING },
                  },
                  required: ["price", "currency"],
                  nullable: true,
                },
                note: { type: Type.STRING },
              },
              required: ["name", "manufacturer", "note"],
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
export async function analyzePrescriptionImage(
  base64Image: string,
  locale: string = "en",
) {
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
