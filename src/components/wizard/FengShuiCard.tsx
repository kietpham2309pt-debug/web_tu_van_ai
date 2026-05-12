import { Compass, Palette, Hammer } from "lucide-react";
import type { FengShuiResult } from "@/lib/feng-shui";

export default function FengShuiCard({
  result,
  birthYear,
}: {
  result: FengShuiResult;
  birthYear: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60">
      <div className="px-5 py-4">
        <div className="text-xs font-bold uppercase tracking-widest text-amber-800">
          PHONG THUỶ · NGŨ HÀNH NẠP ÂM
        </div>
        <h3 className="mt-1 text-2xl font-black text-stone-900">
          Mệnh {result.elementVi}
          <span className="ml-2 text-base font-medium text-stone-600">
            — {result.napam}
          </span>
        </h3>
        <p className="mt-1 text-xs text-stone-500">Năm sinh {birthYear}</p>
        <p className="mt-3 text-sm text-stone-700">{result.description}</p>
      </div>

      <div className="border-t border-amber-200 bg-white/60 px-5 py-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Section icon={Compass} title="Hướng bếp">
            <div className="mb-1.5">
              <div className="text-[10px] font-bold uppercase text-emerald-700">Tốt</div>
              <div className="text-sm font-semibold">{result.goodDirections.join(", ")}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-red-700">Tránh</div>
              <div className="text-sm font-semibold">{result.badDirections.join(", ")}</div>
            </div>
          </Section>

          <Section icon={Palette} title="Màu chủ đạo">
            <div className="space-y-1">
              {result.colors.map((c) => (
                <div key={c.vi} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-4 w-4 flex-shrink-0 rounded border border-stone-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-stone-700">{c.vi}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Hammer} title="Chất liệu hợp">
            <ul className="space-y-1 text-xs text-stone-700">
              {result.materials.slice(0, 4).map((m) => (
                <li key={m} className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-amber-700" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="border-t border-amber-200 bg-amber-700 px-5 py-3 text-xs text-white">
        ✨ Demo bếp AI bên dưới sẽ tự động dùng tông màu hợp mệnh {result.elementVi} của bạn.
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Compass;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600">
        <Icon className="h-3.5 w-3.5 text-amber-700" />
        {title}
      </div>
      {children}
    </div>
  );
}
