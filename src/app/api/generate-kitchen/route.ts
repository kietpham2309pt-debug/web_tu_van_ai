import { NextResponse } from "next/server";
import { buildKitchenPrompt, type KitchenLayout, type KitchenStyle } from "@/lib/kitchen-prompt";
import { SCENARIO_BY_ID } from "@/data/scenarios";
import type { ComboTier } from "@/types";
import { generateGeminiImage } from "@/lib/image-gemini";
import { generateOpenAIImage } from "@/lib/image-openai";
import { generatePollinationsImage } from "@/lib/image-pollinations";

export const runtime = "nodejs";
export const maxDuration = 300;

type Provider = "pollinations" | "gemini" | "openai";

type Body = {
  scenarioId: string;
  tier: ComboTier;
  layout: KitchenLayout;
  style: KitchenStyle;
  provider?: Provider;
  fengShuiHint?: string;
};

function pickDefaultProvider(): Provider {
  // Ưu tiên OpenAI (chất lượng cao nhất, paid) → Gemini → Pollinations (free fallback).
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_API_KEY) return "gemini";
  return "pollinations";
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const scenario = SCENARIO_BY_ID[body.scenarioId];
  if (!scenario) return NextResponse.json({ error: "Scenario không tồn tại" }, { status: 400 });
  const tier = scenario.tiers.find((t) => t.tier === body.tier);
  if (!tier) return NextResponse.json({ error: "Tier không tồn tại" }, { status: 400 });

  const provider = body.provider ?? pickDefaultProvider();
  const prompt = buildKitchenPrompt({
    layout: body.layout,
    style: body.style,
    scenario,
    tier,
    fengShuiHint: body.fengShuiHint,
  });

  async function call(p: Provider): Promise<string> {
    if (p === "openai") return generateOpenAIImage(prompt);
    if (p === "gemini") return generateGeminiImage(prompt);
    return generatePollinationsImage(prompt);
  }

  try {
    let imageUrl: string;
    let usedProvider = provider;

    try {
      imageUrl = await call(provider);
    } catch (err: unknown) {
      // Auto-fallback: nếu Gemini/OpenAI fail (quota, billing...) → thử Pollinations
      if (provider !== "pollinations") {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (/quota|429|403|RESOURCE_EXHAUSTED|PERMISSION_DENIED|billing/i.test(errMsg)) {
          imageUrl = await call("pollinations");
          usedProvider = "pollinations";
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }

    const modelName =
      usedProvider === "gemini"
        ? process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image"
        : usedProvider === "openai"
        ? "gpt-image-1"
        : "flux-1-schnell (Pollinations)";

    return NextResponse.json({
      imageUrl,
      prompt,
      provider: usedProvider,
      model: modelName,
      scenario: scenario.id,
      tier: tier.tier,
      ...(usedProvider !== provider && {
        fallback: `Đã chuyển từ ${provider} sang ${usedProvider} do provider gốc không khả dụng (quota/billing).`,
      }),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    return NextResponse.json({ error: `${provider.toUpperCase()}: ${msg}` }, { status: 502 });
  }
}
