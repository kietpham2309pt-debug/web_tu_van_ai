import type { Metadata } from "next";
import Wizard from "@/components/wizard/Wizard";

export const metadata: Metadata = {
  title: "Tư vấn bếp AI - 5 câu hỏi vàng",
  description:
    "Trả lời 5 câu hỏi vàng từ Playbook BNB. AI sẽ chọn 1 trong 12 kịch bản combo phù hợp và đề xuất 3 phương án Tiết kiệm / Cân bằng / Cao cấp.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const sp = await searchParams;
  return <Wizard initialScenario={sp.scenario} />;
}
