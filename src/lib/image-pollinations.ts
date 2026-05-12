/**
 * Pollinations.ai — image gen miễn phí hoàn toàn, không cần API key.
 * Backend dùng FLUX.1 schnell / SDXL. Có rate limit nhẹ theo IP.
 * Chất lượng vừa phải, đủ cho prototype/demo.
 */
export async function generatePollinationsImage(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1_000_000);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1536&height=1024&nologo=true&enhance=true&model=flux&seed=${seed}`;

  // Retry tối đa 3 lần nếu queue đầy (Pollinations hay trả 500 khi 50/50 jobs)
  let lastErr: string = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BNB-AI-Kitchen/1.0" },
        signal: AbortSignal.timeout(120_000),
      });

      if (res.status === 500 || res.status === 502 || res.status === 503) {
        lastErr = `HTTP ${res.status} (queue full)`;
        // exponential backoff 4s, 8s
        await new Promise((r) => setTimeout(r, attempt * 4000));
        continue;
      }

      if (!res.ok) {
        throw new Error(`Pollinations HTTP ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type") || "image/jpeg";
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) {
        lastErr = "file rỗng";
        await new Promise((r) => setTimeout(r, attempt * 4000));
        continue;
      }
      return `data:${contentType};base64,${buf.toString("base64")}`;
    } catch (e: unknown) {
      lastErr = e instanceof Error ? e.message : String(e);
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 4000));
    }
  }
  throw new Error(`Pollinations: ${lastErr} (đã retry 3 lần — server đang quá tải)`);
}
