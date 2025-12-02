import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { XEEL_CONTEXT } from "../constants";

// Initialize the client. The key MUST be in process.env.API_KEY
// We only create the instance if the key exists to avoid immediate crashes,
// but the functionality will be guarded.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "Error: API Key not found. Please ensure process.env.API_KEY is set.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: XEEL_CONTEXT,
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster chat response
        temperature: 0.7,
      },
    });

    return response.text || "Mi dispiace, non sono riuscito a generare una risposta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Si è verificato un errore temporaneo nel servizio AI. Riprova più tardi.";
  }
};
