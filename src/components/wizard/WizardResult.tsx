"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Phone,
  Award,
} from "lucide-react";
import type { Scenario, WizardAnswers, ComboTier } from "@/types";
import { SCENARIO_BY_ID } from "@/data/scenarios";
import { formatPrice, cn, labels } from "@/lib/utils";
import KitchenDemoLauncher from "@/components/kitchen/KitchenDemoLauncher";
import ProductGroupPanel from "@/components/kitchen/ProductGroupPanel";
import FengShuiCard from "./FengShuiCard";
import { calculateFengShui } from "@/lib/feng-shui";

type Props = {
  answers: WizardAnswers;
  result: { best: Scenario; alternatives: Scenario[] };
  forcedScenarioId?: string;
  onReset: () => void;
};

export default function WizardResult({ answers, result, forcedScenarioId, onReset }: Props) {
  const scenario = forcedScenarioId ? SCENARIO_BY_ID[forcedScenarioId] ?? result.best : result.best;
  const [activeTier, setActiveTier] = useState<ComboTier>("B");
  const tier = scenario.tiers.find((t) => t.tier === activeTier) ?? scenario.tiers[0];
  const fengShui = answers.birthYear ? calculateFengShui(answers.birthYear, answers.gender) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm font-medium text-stone-500 hover:text-stone-800">
          ← Trang chủ
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:border-stone-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Tư vấn lại
        </button>
      </div>

      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
        <Sparkles className="h-3.5 w-3.5" />
        AI đề xuất · {scenario.id}
      </div>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
        {scenario.title}
      </h1>
      <p className="mt-2 max-w-3xl text-stone-600">{scenario.customer}</p>

      {!forcedScenarioId && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {answers.houseType && <Chip>{labels.house(answers.houseType)}</Chip>}
          {answers.budget && <Chip>{labels.budget(answers.budget)}</Chip>}
          {answers.priority && <Chip>{labels.priority(answers.priority)}</Chip>}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {scenario.tiers.map((t) => (
          <button
            key={t.tier}
            onClick={() => setActiveTier(t.tier)}
            className={cn(
              "rounded-xl border-2 px-5 py-3 text-left transition",
              activeTier === t.tier
                ? "border-amber-700 bg-amber-50/40"
                : "border-stone-200 bg-white hover:border-stone-400"
            )}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full text-[10px] font-black",
                  t.tier === "A" && "bg-stone-200 text-stone-700",
                  t.tier === "B" && "bg-amber-700 text-white",
                  t.tier === "C" && "bg-stone-900 text-white"
                )}
              >
                {t.tier}
              </span>
              {t.label}
              {t.tier === "B" && <Award className="h-3 w-3 text-amber-700" />}
            </div>
            <div className="mt-1 text-2xl font-black text-stone-900">{formatPrice(t.total)}</div>
            <div className="text-xs text-stone-500">{t.items.length} thiết bị</div>
          </button>
        ))}
      </div>

      {fengShui && answers.birthYear && (
        <div className="mt-8">
          <FengShuiCard result={fengShui} birthYear={answers.birthYear} />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductGroupPanel scenario={scenario} tier={tier} />

          <div className="mt-6 rounded-2xl bg-stone-50 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-700">
              <CheckCircle2 className="h-4 w-4 text-amber-700" />
              Vì sao combo này phù hợp
            </h3>
            <ul className="space-y-2 text-sm text-stone-700">
              {scenario.reasoning.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-700" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <KitchenDemoLauncher
            scenario={scenario}
            tier={tier}
            element={fengShui?.element}
          />

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-700">
              Bước tiếp theo
            </h3>
            <div className="space-y-2">
              <a
                href="tel:0867450198"
                className="flex items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-700"
              >
                <Phone className="h-4 w-4" />
                Gọi BNB: 0867 450 198
              </a>
              <Link
                href="/lien-he"
                className="flex items-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 hover:border-stone-400"
              >
                Đặt lịch khảo sát tại nhà →
              </Link>
            </div>
          </div>

          {result.alternatives.length > 0 && !forcedScenarioId && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-700">
                Kịch bản tương tự
              </h3>
              <ul className="space-y-2">
                {result.alternatives.slice(0, 3).map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/tu-van-ai?scenario=${s.id}`}
                      className="block rounded-lg border border-stone-200 px-3 py-2 text-sm hover:border-amber-200"
                    >
                      <div className="text-[10px] font-bold text-stone-400">{s.id}</div>
                      <div className="text-stone-800">{s.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-medium text-stone-700">
      {children}
    </span>
  );
}

