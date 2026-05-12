import OpenAI from "openai";

/**
 * Sinh ảnh bằng OpenAI gpt-image-1. Cần verify Organization mới dùng được.
 * Trả về data URL `data:image/png;base64,...`
 */
export async function generateOpenAIImage(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY trong .env.local");

  const client = new OpenAI({ apiKey });
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1536x1024",
    quality: "medium",
    n: 1,
  });

  const item = result.data?.[0];
  if (!item) throw new Error("OpenAI không trả về ảnh");
  return item.b64_json
    ? `data:image/png;base64,${item.b64_json}`
    : item.url ?? "";
}
