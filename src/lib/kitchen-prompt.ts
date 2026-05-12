import type { ComboItem, ComboTierData, Scenario } from "@/types";
import { getProductBySku } from "@/lib/products-data";

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

/** Trả về tên SP gốc nếu lookup được, fallback theo dữ liệu combo. */
function resolveItemName(item: ComboItem): string {
  if (item.sku) {
    const p = getProductBySku(item.sku);
    if (p?.name) return p.name;
  }
  return item.fallbackName;
}

/** Gắn nhãn brand + finish (mặt) dựa trên tên thật. */
function deriveStyleHints(name: string) {
  const n = name.toLowerCase();
  const isBosch = /bosch/.test(n);
  const isKonox = /konox/.test(n);
  const isSpelier = /spelier/.test(n);
  const brandHint = isBosch
    ? "premium German Bosch"
    : isKonox
    ? "high-end Korean Konox"
    : isSpelier
    ? "premium European Spelier"
    : "premium European";
  const isBlack = /matte black|đen mờ|matt black|gun metal|\bbk\b|\bblack\b/.test(n);
  const isInox = /stainless|inox|chrome|cao cấp inox|thép không gỉ/.test(n);
  const finish = isBlack ? "matte black" : isInox ? "stainless steel" : "stainless steel";
  return { brandHint, finish };
}

/** Trích số vùng nấu (2-5) từ tên / SKU. */
function detectCookingZones(name: string, sku: string): number | null {
  const blob = `${name} ${sku}`.toLowerCase();
  const m = blob.match(/(\d)\s*v[uù]ng/);
  if (m) return Number(m[1]);
  if (/domino|đôi/.test(blob)) return 2;
  // Bosch PID6/PI*6 thường 3 vùng, PI*9 4 vùng
  if (/p[ivu][a-z]?9\d/.test(blob)) return 4;
  if (/p[ivu][a-z]?6\d/.test(blob)) return 3;
  return null;
}

/** Mô tả từng thiết bị bằng tiếng Anh dựa trên dữ liệu sản phẩm thật. */
function describeItem(item: ComboItem): string {
  const name = resolveItemName(item);
  const { brandHint, finish } = deriveStyleHints(name);
  const role = item.role.toLowerCase();
  const blob = `${role} ${name}`.toLowerCase();

  // BẾP TỪ
  if (/bếp từ/.test(role)) {
    const zones = detectCookingZones(name, item.sku || "") ?? 3;
    const widthHint = /domino|30cm|đôi/.test(blob) ? "narrow 30cm domino" : "60cm wide";
    return (
      `a ${brandHint} ${widthHint} induction cooktop with exactly ${zones} cooking zones on a sleek black glass surface, ` +
      `flush-mounted on the main counter (${name})`
    );
  }

  // MÁY HÚT MÙI
  if (/hút mùi|hút khử/.test(role)) {
    const isTShape = /chữ t|t.shape|t.kiểu/.test(blob);
    const isIsland = /đảo|island/.test(blob) && !isTShape;
    const isSlim = /slim|âm tủ|under.cabinet|kéo trượt/.test(blob);
    const isChimney = /pyramid|tháp|chimney|treo tường|kim cương/.test(blob);

    if (isTShape) {
      return (
        `a ${brandHint} ${finish} T-shape wall-mounted rangehood with a flat angled glass-and-metal canopy ` +
        `fixed against the back wall above the cooktop, NOT a chimney and NOT an island hood (${name})`
      );
    }
    if (isIsland) {
      return (
        `a ${brandHint} ${finish} island rangehood suspended from the ceiling by 4 cables above the cooktop, ` +
        `with a slim rectangular canopy (${name})`
      );
    }
    if (isSlim) {
      return (
        `a ${brandHint} ${finish} slim built-in rangehood integrated under the upper wall cabinet above the cooktop (${name})`
      );
    }
    if (isChimney) {
      return (
        `a ${brandHint} ${finish} chimney rangehood mounted on the wall above the cooktop with a vertical metal duct (${name})`
      );
    }
    // default: wall-mount classic chimney
    return (
      `a ${brandHint} ${finish} wall-mounted chimney rangehood above the cooktop with a vertical duct (${name})`
    );
  }

  // MÁY RỬA CHÉN
  if (/rửa chén|rửa bát/.test(role)) {
    const isFreestanding =
      /độc lập|free.standing|đứng/.test(blob) || /^sms\d/i.test(item.sku || "");
    const isFullyIntegrated =
      /âm toàn phần|fully integrated|toàn phần/.test(blob) || /^smv/i.test(item.sku || "");
    const isSemiIntegrated =
      /bán âm|semi.integrated|âm bán phần/.test(blob) || /^smi/i.test(item.sku || "");

    if (isFreestanding) {
      return (
        `a ${brandHint} freestanding dishwasher placed in a dedicated tall cabinet slot, ` +
        `${finish} front with a visible top control panel and brand badge — NOT integrated into the cabinetry (${name})`
      );
    }
    if (isFullyIntegrated) {
      return (
        `a ${brandHint} fully integrated dishwasher completely hidden behind a matching cabinet panel in the lower cabinetry, ` +
        `controls only visible from the top edge (${name})`
      );
    }
    if (isSemiIntegrated) {
      return (
        `a ${brandHint} semi-integrated dishwasher with a visible top control strip and a cabinet-matching front (${name})`
      );
    }
    return `a ${brandHint} built-in dishwasher integrated into the lower cabinetry, ${finish} front (${name})`;
  }

  // LÒ NƯỚNG
  if (/lò nướng/.test(role)) {
    return `a ${brandHint} built-in single oven flush-mounted in a tall cabinet column, ${finish} front with glass door and a digital display (${name})`;
  }

  // LÒ VI SÓNG
  if (/vi sóng|microwave/.test(role)) {
    const isBuiltin = /âm tủ|built.in|bel|bfl/i.test(blob);
    if (isBuiltin) {
      return (
        `a ${brandHint} built-in microwave oven flush-mounted in a wall cabinet column, ` +
        `${finish} front with a digital display and a single dial (${name})`
      );
    }
    return `a ${brandHint} compact countertop microwave placed on the side counter, ${finish} (${name})`;
  }

  // LÒ HẤP
  if (/hấp|steam/.test(role)) {
    return `a ${brandHint} built-in steam oven stacked next to the main oven, ${finish} front (${name})`;
  }

  // CHẬU RỬA
  if (/chậu rửa/.test(role)) {
    const isGranite = /granite|đá|composite/.test(blob);
    if (isGranite) {
      return (
        `a Konox granite undermount kitchen sink with a single deep bowl in matte stone finish, ` +
        `set under the quartz countertop near the window (${name})`
      );
    }
    const isDouble = /đôi|double|2 hộc|2-bowl/.test(blob);
    return (
      `a Konox stainless steel undermount kitchen sink with ${isDouble ? "two bowls" : "a single bowl"}, ` +
      `set under the quartz countertop near the window, with a small drain board (${name})`
    );
  }

  // VÒI RỬA
  if (/vòi rửa/.test(role)) {
    const isPullDown = /dây rút|pull.down|kéo|spray/.test(blob);
    const isHigh = /cao|tall|high.arc/.test(blob);
    const colorTone = /gun metal/.test(blob)
      ? "matte gun-metal grey"
      : /chrome/.test(blob)
      ? "polished chrome"
      : "polished chrome";
    return (
      `a Konox ${isHigh ? "tall arched" : "compact arched"} kitchen faucet with ${colorTone} finish` +
      `${isPullDown ? " and a pull-down spray head" : ""}, mounted next to the sink (${name})`
    );
  }

  // TỦ RƯỢU
  if (/tủ rượu|wine/.test(role)) {
    return `a built-in dual-zone wine cooler with a tinted glass door integrated into the island base (${name})`;
  }

  return `${item.role}: ${name}`;
}

function shortRoleHint(role: string): string {
  const r = role.toLowerCase();
  if (/bếp từ/.test(r)) return "induction cooktop — install flush on the main counter";
  if (/hút mùi|khử/.test(r)) return "rangehood — mount above the cooktop";
  if (/rửa chén|rửa bát/.test(r)) return "dishwasher — place in a dedicated cabinet slot";
  if (/lò nướng/.test(r)) return "oven — mount in a tall cabinet column";
  if (/vi sóng|microwave/.test(r)) return "microwave — mount in a wall cabinet column";
  if (/hấp|steam/.test(r)) return "steam oven — mount in a tall cabinet column";
  if (/chậu rửa/.test(r)) return "kitchen sink — install undermount on the countertop";
  if (/vòi rửa/.test(r)) return "kitchen faucet — mount next to the sink";
  if (/tủ rượu|wine/.test(r)) return "wine cooler — integrate into the island base";
  return `${role}`;
}

/** Mô tả thuần text (không reference). Dùng khi không có ảnh sản phẩm. */
export function buildKitchenPrompt(args: {
  layout: KitchenLayout;
  style: KitchenStyle;
  scenario: Scenario;
  tier: ComboTierData;
  fengShuiHint?: string;
}): string {
  const { layout, style, scenario, tier, fengShuiHint } = args;
  const houseHint =
    scenario.filters.houseTypes[0] === "biet-thu"
      ? "spacious luxury Vietnamese villa kitchen"
      : scenario.filters.houseTypes[0] === "nha-pho"
      ? "Vietnamese townhouse kitchen, 4m wide"
      : "modern Vietnamese apartment kitchen";

  const items = tier.items.map(describeItem);
  const itemList = items.map((s, i) => `(${i + 1}) ${s}`).join("; ");

  return [
    `Professional architectural interior photograph of a ${houseHint}.`,
    `Layout: ${LAYOUT_DESC[layout]}.`,
    `Design: ${STYLE_DESC[style]}.`,
    fengShuiHint ? `Color palette adjusted to: ${fengShuiHint}.` : "",
    `The kitchen MUST clearly and accurately feature these specific appliances, each rendered to match its exact described type, form factor and finish — do not substitute, merge or invent alternative shapes: ${itemList}.`,
    `Constraints: render exactly the listed appliances and nothing else — no extra ovens, no extra hoods, no second cooktop, no fridge, no people, no text, no logos.`,
    `Magazine-quality interior photography, sharp focus on appliance details, balanced soft daylight, 8K, photorealistic, color-graded warm and inviting.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Prompt cho mode reference (compose từ ảnh sản phẩm thật). */
export function buildComposePrompt(args: {
  layout: KitchenLayout;
  style: KitchenStyle;
  scenario: Scenario;
  tier: ComboTierData;
  fengShuiHint?: string;
  /** Danh sách item TƯƠNG ỨNG với thứ tự reference images đã gửi lên OpenAI. */
  referencedItems: ComboItem[];
}): string {
  const { layout, style, scenario, tier, fengShuiHint, referencedItems } = args;
  const houseHint =
    scenario.filters.houseTypes[0] === "biet-thu"
      ? "spacious luxury Vietnamese villa kitchen"
      : scenario.filters.houseTypes[0] === "nha-pho"
      ? "Vietnamese townhouse kitchen, 4m wide"
      : "modern Vietnamese apartment kitchen";

  const placements = referencedItems
    .map((it, i) => `(Reference ${i + 1}) ${shortRoleHint(it.role)}`)
    .join("; ");

  return [
    `Compose a professional architectural interior photograph of a ${houseHint}.`,
    `Layout: ${LAYOUT_DESC[layout]}.`,
    `Design: ${STYLE_DESC[style]}.`,
    fengShuiHint ? `Color palette adjusted to: ${fengShuiHint}.` : "",
    `Place the appliances shown in the reference images into the kitchen, in this order: ${placements}.`,
    `Keep every appliance's exact shape, proportions, finish color, panel layout, control buttons and brand badge visually faithful to its reference image. Do not redesign or stylize the appliances — render each one as if photographed in this kitchen.`,
    `Show only the appliances from the reference images plus the cabinetry, countertop, walls, floor and lighting that match the chosen design. Do not invent additional appliances. No people, no text overlays, no logos beyond what is already on the reference appliances.`,
    `Photorealistic magazine-quality interior photography, sharp focus, natural perspective, balanced soft daylight, 8K, color-graded warm and inviting.`,
  ]
    .filter(Boolean)
    .join(" ");
}
