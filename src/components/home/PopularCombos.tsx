import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SCENARIOS } from "@/data/scenarios";
import { formatPrice } from "@/lib/utils";

export default function PopularCombos() {
  const showcase = SCENARIOS.slice(0, 6);

  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-800">
              12 KỊCH BẢN MẪU
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Combo bếp được chọn nhiều nhất
            </h2>
            <p className="mt-3 max-w-xl text-stone-600">
              Mỗi kịch bản gồm 3 phương án Tiết kiệm / Cân bằng / Cao cấp — chốt từ playbook BNB
              với SKU và giá thật.
            </p>
          </div>
          <Link
            href="/tu-van-ai"
            className="hidden whitespace-nowrap rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-400 md:inline-flex"
          >
            Tìm combo cho tôi →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {showcase.map((s) => {
            const mid = s.tiers.find((t) => t.tier === "B") ?? s.tiers[0];
            return (
              <Link
                key={s.id}
                href={`/tu-van-ai?scenario=${s.id}`}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
                    {s.id}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-amber-700" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900 line-clamp-2">{s.title}</h3>
                <p className="mt-2 text-sm text-stone-600 line-clamp-2">{s.customer}</p>
                <div className="mt-5 border-t border-stone-100 pt-4">
                  <div className="text-xs uppercase tracking-wider text-stone-500">
                    Combo khuyên dùng
                  </div>
                  <div className="mt-1 text-2xl font-black text-amber-800">
                    {formatPrice(mid.total)}
                  </div>
                  <div className="mt-1 text-xs text-stone-500">{mid.items.length} thiết bị</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
