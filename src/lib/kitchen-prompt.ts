import type { ComboTierData, Scenario } from "@/types";

export type KitchenLayout = "i-shape" | "l-shape" | "u-shape" | "island";
export type KitchenStyle = "modern" | "scandi" | "luxury" | "industrial";

export const LAYOUTS: { id: KitchenLayout; label: string; description: string }[] = [
  { id: "i-shape", label: "Chữ I", description: "Bếp 1 cạnh — phù hợp căn hộ nhỏ" },
  { id: "l-shape", label: "Chữ L", description: "Bếp góc — phổ biến nhất, tận dụng góc tốt" },
  { id: "u-shape", label: "Chữ U", description: "Bếp bao 3 mặt — dành cho nhà phố lớn" },
  { id: "island", label: "Bếp đảo", description: "Có đảo trung tâm — penthouse / biệt thự" },
];

export const STYLES: { id: KitchenStyle; label: string; description: string }[] = [
  { id: "modern", label: "Hiện đại tối giản", description: "Tủ phẳng, gam trắng - xám - vân gỗ" },
  { id: "scandi", label: "Scandinavian", description: "Gỗ sáng, trắng kem, ánh sáng tự nhiên" },
  { id: "luxury", label: "Sang trọng", description: "Đá marble, gỗ óc chó, ánh đồng" },
  { id: "industrial", label: "Industrial", description: "Bê tông, kim loại, gam đậm" },
];

const LAYOUT_DESC: Record<KitchenLayout, string> = {
  "i-shape": "single-wall I-shape kitchen layout viewed straight on, all appliances along one wall",
  "l-shape": "corner L-shape kitchen layout, two perpendicular counters forming an L viewed from a 3/4 angle",
  "u-shape": "U-shape kitchen layout wrapping three walls of a Vietnamese house, viewed from the open side",
  "island": "open-plan kitchen with a central island and back wall of cabinets, contemporary Vietnamese penthouse",
};

const STYLE_DESC: Record<KitchenStyle, string> = {
  modern:
    "modern minimalist style, flat handleless white and warm grey cabinets, light oak wood floor, white quartz countertop, soft daylight",
  scandi:
    "Scandinavian style, light oak cabinets with matte white panels, terrazzo countertop, large window with sheer curtains, abundant natural light",
  luxury:
    "luxury style, walnut and matte black cabinets with brushed brass accents, white Calacatta marble countertop and backsplash, recessed warm spot lighting",
  industrial:
    "industrial style, dark charcoal and rough oak cabinets, black-stained oak countertop, exposed concrete wall, metal pendant lights, moody warm lighting",
};

/**
 * Map role (vai trò trong combo) → mô tả thiết bị bằng tiếng Anh để gpt-image-1 hiểu.
 */
function describeItem(role: string, name: string): string {
  const r = role.toLowerCase();
  const lower = name.toLowerCase();
  const isBosch = /bosch/.test(lower);
  const isBlack = /(black|bk|bb|đen)/.test(lower);

  const brandHint = isBosch ? "premium German built-in" : "premium European built-in";
  const colorHint = isBlack ? "matte black" : "stainless steel";

  if (/bếp từ/.test(r)) {
    return `a ${brandHint} ${colorHint} induction cooktop with 2-4 cooking zones flush-mounted on the main counter (${name})`;
  }
  if (/hút mùi/.test(r)) {
    return /đảo/.test(name)
      ? `a ${brandHint} ${colorHint} island rangehood suspended from the ceiling above the cooktop (${name})`
      : `a ${brandHint} ${colorHint} chimney rangehood mounted on the wall above the cooktop (${name})`;
  }
  if (/rửa chén/.test(r)) {
    return `a ${brandHint} built-in dishwasher integrated into the lower cabinetry, ${colorHint} front (${name})`;
  }
  if (/lò nướng/.test(r)) {
    return `a ${brandHint} built-in oven stacked in a tall cabinet column, ${colorHint} front with glass door (${name})`;
  }
  if (/vi sóng/.test(r)) {
    return `a ${brandHint} built-in microwave/combi oven flush with the cabinet face above the oven (${name})`;
  }
  if (/hấp/.test(r)) {
    return `a ${brandHint} built-in steam oven stacked next to the main oven (${name})`;
  }
  if (/chậu rửa/.test(r)) {
    return `a Konox stainless steel undermount kitchen sink on the counter near the window (${name})`;
  }
  if (/vòi rửa/.test(r)) {
    return `a Konox tall pull-down kitchen faucet (${name})`;
  }
  if (/tủ rượu/.test(r)) {
    return `a built-in dual-zone wine cooler with glass door integrated into the island (${name})`;
  }
  return `${role}: ${name}`;
}

export function buildKitchenPrompt(args: {
  layout: KitchenLayout;
  style: KitchenStyle;
  scenario: Scenario;
  tier: ComboTierData;
  /** Tuỳ chọn: gợi ý phong thủy theo mệnh → nhúng vào palette */
  fengShuiHint?: string;
}): string {
  const { layout, style, scenario, tier, fengShuiHint } = args;
  const houseHint = scenario.filters.houseTypes[0] === "biet-thu"
    ? "spacious luxury Vietnamese villa kitchen"
    : scenario.filters.houseTypes[0] === "nha-pho"
    ? "Vietnamese townhouse kitchen, 4m wide"
    : "modern Vietnamese apartment kitchen";

  const items = tier.items.map((i) => describeItem(i.role, i.fallbackName));
  const itemList = items.map((s, i) => `${i + 1}. ${s}`).join("; ");

  return [
    `Professional architectural interior photograph of a ${houseHint}.`,
    `Layout: ${LAYOUT_DESC[layout]}.`,
    `Design: ${STYLE_DESC[style]}.`,
    fengShuiHint ? `Color palette adjusted to: ${fengShuiHint}.` : "",
    `The kitchen must clearly feature the following specific built-in appliances installed in their correct functional positions: ${itemList}.`,
    `Style cues: clean staging, no clutter, no people, no text or logos, no extra appliances beyond those listed,`,
    `magazine-quality interior photography, sharp focus, balanced soft daylight, 8K, photorealistic, color-graded warm and inviting.`,
  ].filter(Boolean).join(" ");
}
