import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { MYENV } from "../../config/environment";

const apiKey = MYENV.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY tidak ditemukan");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Menganalisis gambar menggunakan Gemini API.
 * @param imageBuffer Buffer dari file gambar.
 * @param mimeType Tipe MIME gambar (e.g., 'image/jpeg').
 * @param prompt Prompt teks untuk analisis.
 * @returns Hasil teks analisis dari Gemini.
 */
export async function analyzeImageWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
  prompt: string
): Promise<string> {
  const imagePart: Part = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text();
}
