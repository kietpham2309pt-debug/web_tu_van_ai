import type { Metadata } from "next";
import KitchenDemo from "@/components/kitchen/KitchenDemo";
import type { ComboTier } from "@/types";
import type { Element } from "@/lib/feng-shui-meta";

export const metadata: Metadata = {
  title: "Demo căn bếp bằng AI",
  description:
    "Sinh ảnh AI realistic căn bếp với combo thiết bị bạn chọn. Chọn layout (chữ I/L/U/đảo), phong cách (hiện đại, Scandi, sang trọng, industrial) — AI sẽ vẽ trong 15-40 giây.",
};

const ELEMENTS = ["Kim", "Moc", "Thuy", "Hoa", "Tho"] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string; tier?: string; element?: string }>;
}) {
  const sp = await searchParams;
  const tier = (["A", "B", "C"].includes(sp.tier ?? "") ? sp.tier : undefined) as ComboTier | undefined;
  const element = (ELEMENTS as readonly string[]).includes(sp.element ?? "")
    ? (sp.element as Element)
    : undefined;
  return <KitchenDemo initialScenarioId={sp.scenario} initialTier={tier} initialElement={element} />;
}
