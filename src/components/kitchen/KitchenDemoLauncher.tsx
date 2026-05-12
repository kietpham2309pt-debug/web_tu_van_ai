import Link from "next/link";
import { ImagePlus, ArrowRight } from "lucide-react";
import type { ComboTierData, Scenario } from "@/types";
import type { Element } from "@/lib/feng-shui";

export default function KitchenDemoLauncher({
  scenario,
  tier,
  element,
}: {
  scenario: Scenario;
  tier: ComboTierData;
  element?: Element;
}) {
  const href = element
    ? `/demo-bep?scenario=${scenario.id}&tier=${tier.tier}&element=${element}`
    : `/demo-bep?scenario=${scenario.id}&tier=${tier.tier}`;
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 p-5 transition hover:border-amber-700 hover:shadow-xl"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-700 text-white">
          <ImagePlus className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
            AI · GPT-IMAGE-1
          </div>
          <h3 className="font-black text-stone-900">Vẽ căn bếp của bạn</h3>
        </div>
        <ArrowRight className="h-5 w-5 text-amber-700 transition group-hover:translate-x-0.5" />
      </div>
      <p className="mt-3 text-sm text-amber-900/80">
        Sinh ảnh demo realistic căn bếp với chính {tier.items.length} thiết bị bạn vừa chọn — chọn
        layout (chữ I/L/U/đảo) và phong cách.
        {element && (
          <span className="mt-2 block font-semibold">
            ✨ Tự động dùng tông màu mệnh {element === "Kim" ? "Kim" : element === "Moc" ? "Mộc" : element === "Thuy" ? "Thuỷ" : element === "Hoa" ? "Hoả" : "Thổ"}.
          </span>
        )}
      </p>
    </Link>
  );
}
