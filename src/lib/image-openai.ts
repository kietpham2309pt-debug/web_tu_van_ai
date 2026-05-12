import OpenAI, { toFile } from "openai";

export type OpenAIImageQuality = "low" | "medium" | "high";

async function fetchAsUploadable(url: string, idx: number) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch reference ${idx} fail (${r.status}): ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const mime = r.headers.get("content-type") || "image/png";
  const ext = mime.includes("jpeg")
    ? "jpg"
    : mime.includes("webp")
    ? "webp"
    : "png";
  return toFile(buf, `ref-${idx}.${ext}`, { type: mime });
}

export async function generateOpenAIImage(
  prompt: string,
  quality: OpenAIImageQuality = "medium",
  referenceImageUrls?: string[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY trong .env.local");

  const client = new OpenAI({ apiKey });

  const refs = (referenceImageUrls || []).filter(Boolean).slice(0, 10);

  if (refs.length > 0) {
    const files = await Promise.all(refs.map((u, i) => fetchAsUploadable(u, i)));
    const result = await client.images.edit({
      model: "gpt-image-1",
      image: files,
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
