import OpenAI from "openai";

export type OpenAIImageQuality = "low" | "medium" | "high";

export async function generateOpenAIImage(
  prompt: string,
  quality: OpenAIImageQuality = "medium"
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY trong .env.local");

  const client = new OpenAI({ apiKey });
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1536x1024",
    quality,
    n: 1,
  });

  const item = result.data?.[0];
  if (!item) throw new Error("OpenAI không trả về ảnh");
  return item.b64_json
    ? `data:image/png;base64,${item.b64_json}`
    : item.url ?? "";
}
