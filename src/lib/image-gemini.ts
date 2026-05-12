import { GoogleGenAI } from "@google/genai";

/**
 * Sinh ảnh bằng Google Gemini API.
 *
 * Mặc định dùng `gemini-2.5-flash-image-preview` (multimodal, free tier rộng nhất).
 * Có thể override sang Imagen 4 qua env `GEMINI_IMAGE_MODEL=imagen-4.0-generate-001`
 * (Imagen yêu cầu gói trả phí ở một số region).
 *
 * Trả về data URL `data:image/png;base64,...`
 */
export async function generateGeminiImage(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Thiếu GOOGLE_API_KEY trong .env.local");

  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const ai = new GoogleGenAI({ apiKey });

  // ── Imagen models (text-to-image chuyên dụng) ──
  if (model.startsWith("imagen")) {
    const result = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "3:2",
        outputMimeType: "image/png",
      },
    });
    const first = result.generatedImages?.[0]?.image?.imageBytes;
    if (!first) throw new Error("Imagen không trả về ảnh (có thể bị filter an toàn)");
    return `data:image/png;base64,${first}`;
  }

  // ── Gemini Flash Image (multimodal generateContent) ──
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType || "image/png";
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }

  // Nếu không có inline image, có thể model trả text từ chối / lỗi
  const text = parts.find((p) => p.text)?.text;
  throw new Error(
    text
      ? `Gemini không sinh ảnh, trả về text: ${text.slice(0, 200)}`
      : "Gemini không trả về ảnh (response rỗng)"
  );
}
