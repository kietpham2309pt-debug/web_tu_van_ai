import { NextResponse } from "next/server";
import {
  buildKitchenPrompt,
  buildComposePrompt,
  type KitchenLayout,
  type KitchenStyle,
} from "@/lib/kitchen-prompt";
import { SCENARIO_BY_ID } from "@/data/scenarios";
import type { ComboItem, ComboTier } from "@/types";
import { generateGeminiImage } from "@/lib/image-gemini";
import { generateOpenAIImage, type OpenAIImageQuality } from "@/lib/image-openai";
import { generatePollinationsImage } from "@/lib/image-pollinations";
import { getProductBySku } from "@/lib/products-data";

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
  quality?: OpenAIImageQuality;
};

function pickDefaultProvider(): Provider {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_API_KEY) return "gemini";
  return "pollinations";
}

/** Lấy danh sách (item, thumbnail URL) cho các SP match được trong products.json. */
function collectReferences(items: ComboItem[]): {
  referencedItems: ComboItem[];
  urls: string[];
} {
  const refs: { item: ComboItem; url: string }[] = [];
  for (const it of items) {
    if (!it.sku) continue;
    const p = getProductBySku(it.sku);
    const url = p?.thumbnail || p?.images?.[0];
    if (url) refs.push({ item: it, url });
  }
  return {
    referencedItems: refs.map((r) => r.item),
    urls: refs.map((r) => r.url),
  };
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
  const quality: OpenAIImageQuality = body.quality ?? "medium";

  const { referencedItems, urls: refUrls } = collectReferences(tier.items);
  const useReferences = provider === "openai" && refUrls.length > 0;

  const prompt = useReferences
    ? buildComposePrompt({
        layout: body.layout,
        style: body.style,
        scenario,
        tier,
        fengShuiHint: body.fengShuiHint,
        referencedItems,
      })
    : buildKitchenPrompt({
        layout: body.layout,
        style: body.style,
        scenario,
        tier,
        fengShuiHint: body.fengShuiHint,
      });

  async function call(p: Provider): Promise<string> {
    if (p === "openai") return generateOpenAIImage(prompt, quality, useReferences ? refUrls : undefined);
    if (p === "gemini") return generateGeminiImage(prompt);
    return generatePollinationsImage(prompt);
  }

  try {
    let imageUrl: string;
    let usedProvider = provider;

    try {
      imageUrl = await call(provider);
    } catch (err: unknown) {
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
      mode: useReferences && usedProvider === "openai" ? "compose-with-references" : "text-only",
      referencesUsed: useReferences ? refUrls.length : 0,
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
