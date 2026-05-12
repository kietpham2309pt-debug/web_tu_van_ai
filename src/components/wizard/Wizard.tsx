"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Home,
  Sparkles,
  Users,
  Wallet,
  Heart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
  Compass,
} from "lucide-react";
import type { WizardAnswers } from "@/types";
import { matchScenarios } from "@/lib/match-scenario";
import { cn } from "@/lib/utils";
import WizardResult from "./WizardResult";

type StepConfig = {
  key: keyof WizardAnswers;
  icon: typeof Home;
  title: string;
  question: string;
  options: { value: string; label: string; hint?: string }[];
};

const STEPS: StepConfig[] = [
  {
    key: "houseType",
    icon: Home,
    title: "Loại nhà",
    question: "Anh chị đang ở loại nhà nào?",
    options: [
      { value: "chung-cu", label: "Chung cư", hint: "50 - 120m²" },
      { value: "nha-pho", label: "Nhà phố", hint: "100 - 250m²" },
      { value: "biet-thu", label: "Biệt thự / Penthouse", hint: "> 200m²" },
    ],
  },
  {
    key: "status",
    icon: Sparkles,
    title: "Tình trạng",
    question: "Bếp này cho nhà mới hay đang nâng cấp?",
    options: [
      { value: "nha-moi", label: "Nhà mới", hint: "Làm bếp từ đầu" },
      { value: "cai-tao", label: "Cải tạo / Nâng cấp", hint: "Thay 1-2 thiết bị" },
      { value: "tham-khao", label: "Đang tham khảo", hint: "Chưa quyết định" },
    ],
  },
  {
    key: "family",
    icon: Users,
    title: "Gia đình",
    question: "Gia đình mình bao nhiêu người và kiểu nấu thế nào?",
    options: [
      { value: "1-2", label: "1 - 2 người", hint: "Nấu nhẹ, ít món" },
      { value: "3-4", label: "3 - 4 người", hint: "Nấu cơm Việt hàng ngày" },
      { value: "5+", label: "5 người trở lên", hint: "Có người già / con nhỏ" },
    ],
  },
  {
    key: "budget",
    icon: Wallet,
    title: "Ngân sách",
    question: "Ngân sách dự kiến cho thiết bị bếp?",
    options: [
      { value: "duoi-15", label: "Dưới 15 triệu", hint: "Mua lẻ 1-2 món" },
      { value: "15-30", label: "15 - 30 triệu", hint: "Combo cơ bản" },
      { value: "30-60", label: "30 - 60 triệu", hint: "Có máy rửa chén" },
      { value: "60-100", label: "60 - 100 triệu", hint: "Bosch tầm trung" },
      { value: "100-150", label: "100 - 150 triệu", hint: "Cao cấp đồng bộ" },
      { value: "tren-150", label: "Trên 150 triệu", hint: "Full Bosch / penthouse" },
    ],
  },
  {
    key: "priority",
    icon: Heart,
    title: "Ưu tiên",
    question: "Anh chị quan tâm nhất điều gì khi chọn bếp?",
    options: [
      { value: "gia-tot", label: "Giá tốt, vừa đủ", hint: "Không thừa tính năng" },
      { value: "can-bang", label: "Cân bằng giá & chất", hint: "Khuyên dùng" },
      { value: "ben-cao-cap", label: "Bền, cao cấp lâu dài", hint: "10+ năm" },
      { value: "thuong-hieu-duc", label: "Thương hiệu Đức", hint: "Bosch / Spelier" },
      { value: "nuong-banh", label: "Hay nướng / làm bánh", hint: "Cần lò xịn" },
    ],
  },
];

type Props = { initialScenario?: string };

export default function Wizard({ initialScenario }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [showResult, setShowResult] = useState<boolean>(!!initialScenario);

  const result = useMemo(() => {
    if (initialScenario && !showResult) return null;
    if (Object.keys(answers).length < 1 && !initialScenario) return null;
    return matchScenarios(answers);
  }, [answers, initialScenario, showResult]);

  if (showResult && result) {
    return (
      <WizardResult
        answers={answers}
        result={result}
        forcedScenarioId={initialScenario}
        onReset={() => {
          setAnswers({});
          setStep(0);
          setShowResult(false);
        }}
      />
    );
  }

  // Step cuối là step "phong thuỷ" (optional, ngoài STEPS)
  const FENG_SHUI_STEP = STEPS.length;
  const totalSteps = STEPS.length + 1;
  const onFengShuiStep = step === FENG_SHUI_STEP;
  const cur = STEPS[Math.min(step, STEPS.length - 1)];
  const progress = ((step + 1) / totalSteps) * 100;
  const selected = !onFengShuiStep ? answers[cur.key] : undefined;

  function pick(value: string) {
    const next = { ...answers, [cur.key]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < totalSteps) setStep(step + 1);
      else setShowResult(true);
    }, 200);
  }

  function setFengShui(birthYear: number | undefined, gender: "nam" | "nu" | undefined) {
    setAnswers((a) => ({ ...a, birthYear, gender }));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-20">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-stone-800"
        >
          ← Trang chủ
        </Link>
        <button
          onClick={() => {
            setAnswers({});
            setStep(0);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Làm lại
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>
          BƯỚC {step + 1} / {totalSteps}
        </span>
        <span className="text-amber-800">{cur.title}</span>
      </div>
      <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-amber-700 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {onFengShuiStep ? (
        <FengShuiStep
          birthYear={answers.birthYear}
          gender={answers.gender}
          onChange={setFengShui}
          onSubmit={() => setShowResult(true)}
          onBack={() => setStep(step - 1)}
        />
      ) : (
        <div key={step} className="animate-fade-in-up">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-800">
              <cur.icon className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
              {cur.question}
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cur.options.map((opt) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => pick(opt.value)}
                  className={cn(
                    "group flex items-center justify-between gap-4 rounded-2xl border-2 bg-white px-5 py-4 text-left transition",
                    active
                      ? "border-amber-700 bg-amber-50/40 shadow-md"
                      : "border-stone-200 hover:border-stone-400"
                  )}
                >
                  <div>
                    <div className="font-semibold text-stone-900">{opt.label}</div>
                    {opt.hint && (
                      <div className="mt-0.5 text-sm text-stone-500">{opt.hint}</div>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition",
                      active ? "text-amber-700" : "text-stone-300 group-hover:text-stone-500"
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:text-stone-800 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </button>
            {selected && (
              <button
                onClick={() => {
                  if (step + 1 < totalSteps) setStep(step + 1);
                  else setShowResult(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Tiếp theo
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-600">
        <strong className="text-stone-900">💡 Vì sao 5 câu này đủ?</strong> Đây là "5 câu hỏi
        vàng" từ Playbook BNB — đội sales BNB cũng dùng đúng quy trình này tại showroom. Hệ thống
        sẽ khớp câu trả lời với 1 trong 12 kịch bản chuẩn để đề xuất 3 combo Tiết kiệm / Cân bằng /
        Cao cấp.
      </div>
    </div>
  );
}

function FengShuiStep({
  birthYear,
  gender,
  onChange,
  onSubmit,
  onBack,
}: {
  birthYear?: number;
  gender?: "nam" | "nu";
  onChange: (year: number | undefined, gender: "nam" | "nu" | undefined) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-800">
          <Compass className="h-6 w-6" />
        </span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
            BƯỚC CUỐI · TUỲ CHỌN
          </div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            Phong thuỷ — nhập năm sinh để gợi ý màu hợp mệnh
          </h1>
        </div>
      </div>

      <p className="mb-6 text-stone-600">
        Tuỳ chọn. Nhập năm sinh chủ nhà → hệ thống sẽ tính mệnh ngũ hành nạp âm, gợi ý hướng bếp,
        màu sắc và chất liệu hợp mệnh. Demo bếp AI cũng sẽ tự động đổi tông màu theo mệnh.
      </p>

      <div className="rounded-2xl border-2 border-stone-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Năm sinh chủ nhà
            </label>
            <input
              type="number"
              min={1924}
              max={2025}
              value={birthYear ?? ""}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined, gender)}
              placeholder="VD: 1988"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg font-semibold focus:border-amber-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Giới tính
            </label>
            <div className="flex gap-2">
              {(["nam", "nu"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => onChange(birthYear, gender === g ? undefined : g)}
                  className={cn(
                    "flex-1 rounded-xl border-2 px-4 py-3 font-semibold transition",
                    gender === g
                      ? "border-amber-700 bg-amber-50/40 text-amber-900"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                  )}
                >
                  {g === "nam" ? "Nam" : "Nữ"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          ℹ️ Hệ thống dùng bảng <strong>nạp âm 60 năm</strong> theo lịch dương. Năm âm khác năm
          dương khi sinh tháng 1-2 dương lịch — kết quả phù hợp với đa số trường hợp.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:text-stone-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onChange(undefined, undefined);
              onSubmit();
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:text-stone-800"
          >
            Bỏ qua →
          </button>
          <button
            onClick={onSubmit}
            disabled={!birthYear}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-30"
          >
            Xem kết quả
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
