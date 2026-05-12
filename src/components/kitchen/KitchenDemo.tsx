"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  ImagePlus,
  Download,
  RefreshCcw,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { ComboTier, Scenario } from "@/types";
import { SCENARIO_BY_ID } from "@/data/scenarios";
import { LAYOUTS, STYLES, type KitchenLayout, type KitchenStyle } from "@/lib/kitchen-prompt";
import { type Element, META_FOR_PROMPT } from "@/lib/feng-shui-meta";
import { cn, formatPrice } from "@/lib/utils";
import ProductGroupPanel from "./ProductGroupPanel";
import OrderConfirmModal from "./OrderConfirmModal";

type Props = {
  initialScenarioId?: string;
  initialTier?: ComboTier;
  initialElement?: Element;
};

const ELEMENT_LABEL: Record<Element, string> = {
  Kim: "Kim",
  Moc: "Mộc",
  Thuy: "Thuỷ",
  Hoa: "Hoả",
  Tho: "Thổ",
};

export default function KitchenDemo({ initialScenarioId, initialTier, initialElement }: Props) {
  const allScenarios = Object.values(SCENARIO_BY_ID);
  const defaultScenario =
    (initialScenarioId && SCENARIO_BY_ID[initialScenarioId]) || allScenarios[1];
  const defaultTier: ComboTier = initialTier ?? "B";

  const [scenario, setScenario] = useState<Scenario>(defaultScenario);
  const [tierLetter, setTierLetter] = useState<ComboTier>(defaultTier);
  const [layout, setLayout] = useState<KitchenLayout>("l-shape");
  const [style, setStyle] = useState<KitchenStyle>("modern");
  const [element, setElement] = useState<Element | undefined>(initialElement);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; model?: string; fallback?: string } | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [quality, setQuality] = useState<"medium" | "high">("medium");

  const tier = scenario.tiers.find((t) => t.tier === tierLetter) ?? scenario.tiers[0];

  async function generate() {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const res = await fetch("/api/generate-kitchen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          tier: tierLetter,
          layout,
          style,
          fengShuiHint: element ? META_FOR_PROMPT[element] : undefined,
          quality,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định");
      setImage(data.imageUrl);
      setPrompt(data.prompt);
      setMeta({ provider: data.provider, model: data.model, fallback: data.fallback });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lỗi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
        <Sparkles className="h-3.5 w-3.5" />
        AI IMAGE · gpt-image-1
      </div>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        Demo căn bếp bằng AI
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Chọn kịch bản combo, layout và phong cách. AI sẽ tạo ảnh căn bếp realistic với đúng các
        thiết bị bạn chọn — trước khi mua, trước khi thi công.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* IMAGE PANEL */}
        <div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900/80 backdrop-blur text-white">
                <Loader2 className="h-10 w-10 animate-spin" />
                <div className="text-sm font-semibold">AI đang vẽ căn bếp của bạn...</div>
                <div className="px-6 text-center text-xs text-stone-300">
                  {quality === "high"
                    ? "Chất lượng cao: 90-180 giây · Có thể tới 3 phút khi OpenAI bận. Vui lòng đợi, không tải lại trang."
                    : "Thời gian dự kiến: 40-90 giây · Đôi khi 1-2 phút khi OpenAI bận. Vui lòng đợi, không tải lại trang."}
                </div>
              </div>
            )}
            {error && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-50 p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="font-semibold text-red-800">Lỗi sinh ảnh</div>
                <div className="max-w-md text-sm text-red-700">{error}</div>
                <div className="text-xs text-red-600/70">
                  Kiểm tra biến môi trường OPENAI_API_KEY hoặc gói dùng OpenAI Image.
                </div>
              </div>
            )}
            {image && !loading ? (
              <Image
                src={image}
                alt="Demo căn bếp AI"
                fill
                className="object-cover"
                unoptimized
              />
            ) : !loading && !error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-500">
                <ImagePlus className="mb-3 h-12 w-12" />
                <div className="font-semibold">Chưa có ảnh — bấm "Tạo ảnh AI" để bắt đầu</div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {image ? "Tạo lại ảnh" : "Tạo ảnh AI"}
            </button>
            {image && (
              <a
                href={image}
                download={`bnb-kitchen-${scenario.id}-${tierLetter}.png`}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800 hover:border-stone-400"
              >
                <Download className="h-4 w-4" /> Tải ảnh
              </a>
            )}
            {image && (
              <button
                onClick={() => setPdfOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800"
              >
                <FileText className="h-4 w-4" /> Xuất biên bản PDF
              </button>
            )}
            <button
              onClick={() => {
                setImage(null);
                setError(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800 hover:border-stone-400"
            >
              <RefreshCcw className="h-4 w-4" /> Xoá
            </button>
          </div>

          {meta?.fallback && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              ℹ️ {meta.fallback}
            </div>
          )}

          {meta && image && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
              <span className="rounded-md bg-stone-100 px-2 py-1">
                Provider: <strong className="text-stone-900">{meta.provider}</strong>
              </span>
              <span className="rounded-md bg-stone-100 px-2 py-1">
                Model: <strong className="text-stone-900">{meta.model}</strong>
              </span>
            </div>
          )}

          {prompt && (
            <details className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-stone-600">
                Prompt gửi AI (kỹ thuật)
              </summary>
              <p className="mt-3 text-xs text-stone-600">{prompt}</p>
            </details>
          )}

          <div className="mt-8">
            <ProductGroupPanel scenario={scenario} tier={tier} />
          </div>
        </div>

        {/* CONTROL PANEL */}
        <aside className="space-y-5">
          <Panel title="Kịch bản combo">
            <select
              value={scenario.id}
              onChange={(e) => setScenario(SCENARIO_BY_ID[e.target.value])}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
            >
              {allScenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.title}
                </option>
              ))}
            </select>
            <div className="mt-3 flex gap-2">
              {scenario.tiers.map((t) => (
                <button
                  key={t.tier}
                  onClick={() => setTierLetter(t.tier)}
                  className={cn(
                    "flex-1 rounded-lg border-2 px-3 py-2 text-left transition",
                    tierLetter === t.tier
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-stone-200 hover:border-stone-400"
                  )}
                >
                  <div className="text-[10px] font-bold uppercase text-stone-500">
                    {t.tier} · {t.label}
                  </div>
                  <div className="text-sm font-bold">{formatPrice(t.total)}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
              <strong className="text-stone-900">{tier.items.length} thiết bị:</strong>{" "}
              {tier.items.map((i) => i.role).join(", ")}
            </div>
          </Panel>

          <Panel title="Bố cục bếp">
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                    layout === l.id
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-stone-200 hover:border-stone-400"
                  )}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="mt-0.5 text-[11px] text-stone-500">{l.description}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Phong cách thiết kế">
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                    style === s.id
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-stone-200 hover:border-stone-400"
                  )}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="mt-0.5 text-[11px] text-stone-500">{s.description}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Chất lượng ảnh AI">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuality("medium")}
                className={cn(
                  "rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                  quality === "medium"
                    ? "border-amber-700 bg-amber-50/40"
                    : "border-stone-200 hover:border-stone-400"
                )}
              >
                <div className="font-semibold">Tiêu chuẩn</div>
                <div className="mt-0.5 text-[11px] text-stone-500">
                  ~$0.042/ảnh · 40-90s
                </div>
              </button>
              <button
                onClick={() => setQuality("high")}
                className={cn(
                  "rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                  quality === "high"
                    ? "border-amber-700 bg-amber-50/40"
                    : "border-stone-200 hover:border-stone-400"
                )}
              >
                <div className="font-semibold">Cao cấp</div>
                <div className="mt-0.5 text-[11px] text-stone-500">
                  ~$0.167/ảnh · 1.5-3 phút · sắc nét, chi tiết hơn
                </div>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-stone-500">
              Ảnh chốt với khách: nên dùng "Cao cấp" cho chi tiết thiết bị
              chính xác hơn.
            </p>
          </Panel>

          <Panel title="Phong thuỷ (tuỳ chọn)">
            <div className="grid grid-cols-5 gap-1.5">
              {(["Kim", "Moc", "Thuy", "Hoa", "Tho"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setElement(element === e ? undefined : e)}
                  className={cn(
                    "rounded-lg border-2 py-2 text-sm font-semibold transition",
                    element === e
                      ? "border-amber-700 bg-amber-50/40 text-amber-900"
                      : "border-stone-200 hover:border-stone-400 text-stone-700"
                  )}
                >
                  {ELEMENT_LABEL[e]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-stone-500">
              {element
                ? `Đang dùng tông màu mệnh ${ELEMENT_LABEL[element]}. Bấm lại để bỏ.`
                : "Chọn mệnh để AI tự động đổi tông màu hợp phong thuỷ."}
            </p>
          </Panel>

          <div className="rounded-2xl bg-amber-50/60 p-4 text-xs text-amber-900">
            <strong>Lưu ý:</strong> Ảnh AI mang tính minh hoạ và sẽ khác biệt với bản thiết kế thi
            công thực tế. Để có bản vẽ chính xác, đặt lịch khảo sát với BNB.
          </div>

          <Link
            href={`/tu-van-ai?scenario=${scenario.id}`}
            className="block rounded-xl border border-stone-300 bg-white px-4 py-3 text-center text-sm font-semibold text-stone-800 hover:border-stone-400"
          >
            Xem chi tiết kịch bản {scenario.id} →
          </Link>
        </aside>
      </div>

      {image && (
        <OrderConfirmModal
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          scenario={scenario}
          tier={tier}
          layout={layout}
          style={style}
          element={element}
          imageDataUrl={image}
        />
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">{title}</h3>
      {children}
    </div>
  );
}
