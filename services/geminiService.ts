
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeQRCodeImage = async (base64Image: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/png' } },
            { text: "Extract the otpauth:// URI from this QR code. Return only the URI string and nothing else. If it's not an OTP QR code, return 'ERROR'." }
          ]
        }
      ]
    });
    
    const text = response.text?.trim();
    return text === 'ERROR' ? null : text || null;
  } catch (error) {
    console.error("Gemini QR Analysis Error:", error);
    return null;
  }
};

export const getSecurityAdvice = async (query: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction: "You are a cybersecurity expert specializing in 2FA and identity management. Provide concise, actionable advice for securing accounts."
    }
  });
  return response.text || "I'm sorry, I couldn't process that request.";
};
