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
  "i-shape": "single-wall I-shape kitchen layout viewed straight on, all appliances along ONE continuous wall",
  "l-shape": "corner L-shape kitchen layout, TWO perpendicular counter runs forming an L viewed from a 3/4 angle",
  "u-shape": "U-shape kitchen layout wrapping THREE walls of a Vietnamese house, all three counter runs visible, viewed from the open fourth-wall side",
  "island": "open-plan kitchen with a central kitchen island and a parallel back wall of cabinets, contemporary Vietnamese penthouse",
};

const LAYOUT_DESC_WITH_ISLAND: Record<KitchenLayout, string> = {
  "i-shape": "I-shape kitchen with a single continuous wall of cabinets PLUS a parallel central kitchen island; the cooktop sits on the island, the rest of the appliances on the wall",
  "l-shape": "L-shape kitchen (two perpendicular counter runs against the walls) PLUS a central kitchen island in the open space; the cooktop sits on the island below the suspended island hood",
  "u-shape": "U-shape kitchen wrapping three walls PLUS a central kitchen island in the middle of the U (effectively a G-shape); the cooktop sits on the central island below the suspended island hood",
  "island": "open-plan kitchen with a central kitchen island and a parallel back wall of cabinets, contemporary Vietnamese penthouse",
};

const CAMERA_DESC: Record<KitchenLayout, string> = {
  "i-shape": "Camera framed head-on, perpendicular to the single wall, showing the entire wall of cabinets from end to end at roughly eye level",
  "l-shape": "Camera at a 3/4 angle from the open corner of the L, both counter runs clearly visible, vanishing point off-center",
  "u-shape": "Camera positioned at the open fourth-wall side looking into the U, slightly elevated so all THREE counter runs (left wall, back wall, right wall) are visible and clearly form a U around the room",
  "island": "Camera at a 3/4 angle from the living-room side, showing the central island in the foreground and the back wall of cabinets behind it",
};

const STYLE_DESC: Record<KitchenStyle, string> = {
  modern:
    "modern minimalist style — flat handleless slab cabinet doors in matte warm white above and warm grey-taupe below, light oak wood plank floor, pure white quartz countertop with a thin profile, simple white painted walls, soft cool daylight from a side window",
  scandi:
    "Scandinavian style — pale natural oak veneer base cabinets PLUS matte chalk-white upper cabinets (always two-tone, never all-white), light grey terrazzo countertop with small stone chips, wide-plank pale oak flooring, full-height window with sheer linen curtains flooding the room with cool diffuse daylight, a few green potted plants for warmth",
  luxury:
    "luxury style — walnut wood-grain base cabinets and matte black upper cabinets with brushed champagne brass handles and edge trim, polished white Calacatta marble countertop and full-height backsplash with bold grey veining, dark hardwood herringbone floor, recessed warm spot lighting plus a brass linear pendant",
  industrial:
    "industrial style — dark charcoal matte cabinets with rough sawn oak open shelves, black-stained oak butcher-block countertop, exposed grey concrete back wall with visible form-tie holes, blackened steel framing on shelves, hanging black metal pendant lights, moody warm tungsten lighting",
};

const CABINETRY_RULE: Record<KitchenStyle, string> = {
  modern: "Cabinets MUST be flat slab handleless — no shaker frames, no raised panels, no visible hardware.",
  scandi:
    "Cabinets MUST be two-tone: light natural oak veneer for base units and matte chalk-white for upper units — NOT all-white, NOT dark wood, NOT walnut, NOT marble cabinets.",
  luxury:
    "Cabinets MUST mix walnut wood-grain (base) with matte black (upper) and brushed brass trim — NOT all white, NOT light oak.",
  industrial:
    "Cabinets MUST be dark charcoal matte with rough oak open shelves — NOT white, NOT glossy, NOT light oak.",
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
    const sku = (item.sku || "").toLowerCase();
    const isTShape = /chữ t|t.shape|t.kiểu/.test(blob);
    const isIsland = (/đảo|island/.test(blob) || /^dib|^dia|^dwb.*island/.test(sku)) && !isTShape;
    const isSlim = /slim|âm tủ|under.cabinet|kéo trượt|^dft|^dhi/.test(`${blob} ${sku}`);
    const isChimney = /pyramid|tháp|chimney|treo tường|kim cương|^dws|^dwk/.test(`${blob} ${sku}`);

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
        `set into the wet-zone counter on its own dedicated run away from the cooktop (${name})`
      );
    }
    const isDouble = /đôi|double|2\s*hộc|2\s*hố|hố lệch|2.bowl|two.bowl/.test(blob);
    const isOffset = /lệch|offset|unequal/.test(blob);
    const bowlDesc = isDouble
      ? isOffset
        ? "two bowls of UNEQUAL size (one large main bowl and one smaller secondary bowl) separated by a thin divider"
        : "two equally-sized bowls separated by a thin divider"
      : "a single deep rectangular bowl";
    return (
      `a Konox stainless steel undermount kitchen sink with ${bowlDesc}, ` +
      `set into the wet-zone counter on its own dedicated run away from the cooktop, with a small drain board (${name})`
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

/** Hint placement chi tiết theo tên SP cho mode compose-with-references. */
function composePlacementHint(item: ComboItem): string {
  const name = resolveItemName(item);
  const { finish } = deriveStyleHints(name);
  const role = item.role.toLowerCase();
  const blob = `${role} ${name}`.toLowerCase();

  // BẾP TỪ
  if (/bếp từ/.test(role)) {
    const zones = detectCookingZones(name, item.sku || "") ?? 3;
    const widthHint = /domino|30cm|đôi/.test(blob) ? "narrow 30 cm domino-width" : "60 cm-wide";
    return (
      `${widthHint} induction cooktop with EXACTLY ${zones} cooking zones on flat black ceramic glass — ` +
      `flush-mount into the main cooking-zone counter; NO gas burners, NO grates, NO knobs, NO visible flame; ` +
      `keep the reference's exact zone layout, touch-control strip position and brand badge`
    );
  }

  // MÁY HÚT MÙI
  if (/hút mùi|hút khử/.test(role)) {
    const sku = (item.sku || "").toLowerCase();
    const isTShape = /chữ t|t.shape|t.kiểu/.test(blob);
    const isIsland = (/đảo|island/.test(blob) || /^dib|^dia|^dwb.*island/.test(sku)) && !isTShape;
    const isSlim = /slim|âm tủ|under.cabinet|kéo trượt|^dft|^dhi/.test(`${blob} ${sku}`);
    const isChimney = /pyramid|tháp|chimney|treo tường|kim cương|^dws|^dwk/.test(`${blob} ${sku}`);
    if (isTShape) {
      return (
        `T-shape wall-mounted rangehood — copy the flat angled glass-and-metal canopy from the reference, ` +
        `mount tight against the back wall directly above the cooktop with ~70 cm clearance; ` +
        `NOT a pyramid chimney, NOT an island hood, NO vertical duct above the canopy`
      );
    }
    if (isIsland) {
      return (
        `island rangehood suspended from the ceiling above the cooktop by 4 thin cables, ` +
        `slim rectangular canopy exactly as in the reference; NOT wall-mounted, NOT a chimney`
      );
    }
    if (isSlim) {
      return (
        `slim built-in pull-out rangehood integrated UNDER the upper wall cabinet directly above the cooktop, ` +
        `only the front control strip and pull-out slider visible; NOT a chimney, NO duct, NO canopy`
      );
    }
    if (isChimney) {
      return (
        `chimney rangehood on the wall above the cooktop with a vertical metal duct rising to the ceiling, ` +
        `pyramid/cone shape matching the reference; NOT a flat T-shape, NOT slim built-in`
      );
    }
    return (
      `wall-mounted rangehood centered above the cooktop, form factor matching the reference exactly — ` +
      `do NOT invent a different canopy shape`
    );
  }

  // MÁY RỬA CHÉN
  if (/rửa chén|rửa bát/.test(role)) {
    const sku = item.sku || "";
    const isFreestanding = /độc lập|free.standing|đứng/.test(blob) || /^sms\d/i.test(sku);
    const isFullyIntegrated = /âm toàn phần|fully integrated|toàn phần/.test(blob) || /^smv/i.test(sku);
    const isSemiIntegrated = /bán âm|semi.integrated|âm bán phần/.test(blob) || /^smi/i.test(sku);
    if (isFreestanding) {
      return (
        `freestanding dishwasher placed in a dedicated tall cabinet slot in the wet zone next to the sink — ` +
        `${finish} front fully visible with the top control panel, display and brand badge from the reference; ` +
        `do NOT hide it behind a cabinet panel`
      );
    }
    if (isFullyIntegrated) {
      return (
        `fully integrated dishwasher completely concealed behind a cabinet panel matching the surrounding cabinetry in the wet zone, ` +
        `only a thin gap under the countertop hints at it; NO visible appliance front, NO brand badge, NO control panel`
      );
    }
    if (isSemiIntegrated) {
      return (
        `semi-integrated dishwasher in the wet zone next to the sink — visible top control strip above a cabinet-matching front panel`
      );
    }
    return (
      `built-in dishwasher in the wet zone next to the sink, ${finish} front matching the reference's exact panel layout and badge`
    );
  }

  // LÒ NƯỚNG
  if (/lò nướng/.test(role)) {
    return (
      `built-in single oven flush-mounted in the tall storage cabinet column (NOT on the counter, NOT under the cooktop) — ` +
      `${finish} front with a large glass door, digital display strip and round knobs as in the reference; ` +
      `noticeably taller and larger than any microwave in this kitchen`
    );
  }

  // LÒ VI SÓNG
  if (/vi sóng|microwave/.test(role)) {
    const isBuiltin = /âm tủ|built.in|bel|bfl/i.test(blob);
    const hasGrill = /kèm nướng|grill|combi/i.test(blob);
    if (isBuiltin) {
      return (
        `built-in compact microwave oven (25-40 L internal capacity) flush-mounted in the wall cabinet column at upper-eye-level, ` +
        `${finish} front with a digital display and a single dial as in the reference; ` +
        `door is roughly 38-45 cm tall — clearly SHORTER than a full 60 cm oven door` +
        (hasGrill
          ? ". Despite the 'kèm nướng / with-grill' label, this is a MICROWAVE (single compact unit, NOT a full-size oven)"
          : "") +
        `; do NOT render this as a tall oven, do NOT duplicate it`
      );
    }
    return (
      `compact countertop microwave placed on the side counter, ${finish} front matching the reference; ` +
      `NOT built into the cabinetry`
    );
  }

  // LÒ HẤP
  if (/hấp|steam/.test(role)) {
    return (
      `built-in steam oven stacked next to or above the main oven in the same tall column, ` +
      `${finish} front with a small water-tank slot visible behind the door — NOT a regular oven, NOT a microwave`
    );
  }

  // CHẬU + VÒI — chi tiết hoá ở buildFixtureGuidance
  if (/chậu rửa/.test(role)) {
    return "kitchen sink — undermount cutout in the quartz on a dedicated wet-zone counter run (see CRITICAL FIXTURE FIDELITY block)";
  }
  if (/vòi rửa/.test(role)) {
    return "kitchen faucet — deck-mounted directly behind the sink bowl on the same counter slab (see CRITICAL FIXTURE FIDELITY block)";
  }

  // TỦ RƯỢU
  if (/tủ rượu|wine/.test(role)) {
    return (
      `built-in dual-zone wine cooler with a tinted glass door revealing horizontal wine racks, ` +
      `${finish} frame matching the reference; integrate into the island base or storage column`
    );
  }

  return item.role;
}

/** Tổ chức không gian theo layout — giúp AI tách wet/cooking/storage zone. */
const ZONE_ORG: Record<KitchenLayout, string> = {
  "i-shape":
    "Along the single straight wall, arrange zones left-to-right: tall storage column (oven/microwave/steam) at one end, cooking zone (cooktop with rangehood directly above) in the middle, wet zone (sink + faucet + dishwasher) at the other end. Keep at least one base cabinet between the cooking zone and the wet zone.",
  "l-shape":
    "Distribute zones across the two perpendicular counters of the L: place the cooking zone (cooktop + rangehood on the wall directly above it) on one counter run, and the wet zone (sink + faucet + dishwasher next to each other) on the OTHER counter run; the tall storage column (oven/microwave/steam) sits at the far end of one run. Cooking and wet zones must NOT be adjacent on the same counter slab.",
  "u-shape":
    "Use the three sides of the U: cooking zone (cooktop + rangehood above) on one wall, wet zone (sink + faucet + dishwasher) on a second wall, tall storage column (oven/microwave/steam) on the third wall.",
  "island":
    "Place the cooktop + rangehood on the central island (rangehood suspended from the ceiling), the wet zone (sink + faucet + dishwasher) on the back wall opposite the cooking zone, and the tall storage column (oven/microwave/steam) on the back wall as well, separate from the wet zone.",
};

/** Khối hướng dẫn riêng cho chậu + vòi — đây là vùng AI hay render sai nhất. */
function buildFixtureGuidance(items: ComboItem[]): string {
  const sink = items.find((it) => /chậu rửa/i.test(it.role));
  const faucet = items.find((it) => /vòi rửa/i.test(it.role));
  if (!sink && !faucet) return "";

  const parts: string[] = [
    "CRITICAL FIXTURE FIDELITY — the sink-and-faucet zone is the most common failure point in this kind of composite, render it with the same level of detail as a close-up product shot:",
  ];

  if (sink) {
    const name = resolveItemName(sink);
    const blob = name.toLowerCase();
    const isGranite = /granite|đá|composite/.test(blob);
    const isDouble = /đôi|double|2\s*hộc|2\s*hố|hố lệch|2.bowl|two.bowl/.test(blob);
    const isOffset = /lệch|offset|unequal/.test(blob);
    const surface = isGranite
      ? "matte granite stone surface with the exact speckle/grain pattern of the reference"
      : /smart|hạt|nano/.test(blob)
      ? "fine-textured anti-scratch nano stainless steel surface (slightly matte, not mirror-polished)"
      : "brushed stainless steel surface with directional satin grain";
    const layout = isDouble
      ? isOffset
        ? "TWO bowls of UNEQUAL size (one large main bowl on one side, one smaller secondary bowl on the other) separated by a thin stainless divider — exactly matching the asymmetric layout of the reference"
        : "TWO equally-sized bowls separated by a thin stainless divider, matching the reference exactly"
      : "single deep rectangular bowl with the exact internal corner radius from the reference";
    parts.push(
      `Sink (${name}): replicate the reference image pixel-faithfully — same ${surface}, ${layout}, same rim profile, same drain grate position and shape. Install as an undermount cutout in the quartz countertop on its own dedicated counter section; do NOT place it adjacent to the cooktop, do NOT crop or shrink the bowl(s), do NOT cover the bowl(s) with appliances, and do NOT collapse two bowls into one. Every bowl interior must be clean, dry, empty and clearly visible.`
    );
  }

  if (faucet) {
    const name = resolveItemName(faucet);
    const blob = name.toLowerCase();
    const isPullDown = /dây rút|pull.down|kéo|spray/.test(blob);
    const colorTone = /gun metal|gun-metal|đen mờ/.test(blob)
      ? "matte gun-metal grey PVD finish"
      : /chrome/.test(blob)
      ? "polished mirror-chrome PVD finish (the same multilayer reflective chrome as the reference)"
      : "polished chrome PVD finish";
    const head = isPullDown
      ? "pull-down spray head with the exact nozzle profile, hose collar and detail lines visible in the reference"
      : "fixed cylindrical spout outlet with the exact aerator face from the reference";
    parts.push(
      `Faucet (${name}): deck-mounted on the countertop directly behind the center of the sink bowl, base sitting flat on the quartz (no gap, no hovering, no wall-mount). Replicate the reference: same swan-neck arch height-to-bowl ratio, same neck curvature, same ${colorTone}, same single-lever handle position and shape, same ${head}. The spout outlet must aim into the bowl center. Do NOT invent a different faucet shape, do NOT stretch / shrink / re-bend the neck, do NOT duplicate the faucet elsewhere on the counter, do NOT add a secondary filter faucet.`
    );
  }

  if (sink && faucet) {
    parts.push(
      "Sink and faucet share one continuous countertop zone — faucet base must be on the same counter slab as the sink, set 5–8 cm behind the rear edge of the sink bowl. Lighting on this zone must be consistent (same daylight angle as the rest of the kitchen) so chrome reflections look real, not pasted."
    );
  }

  return parts.join(" ");
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
    .map((it, i) => `(Reference ${i + 1}) ${composePlacementHint(it)}`)
    .join("; ");

  const fixtureBlock = buildFixtureGuidance(referencedItems);

  // Phát hiện thiết bị có trong combo.
  const hasInduction = referencedItems.some((it) => /bếp từ/i.test(it.role));
  const hasHood = referencedItems.some((it) => /hút mùi|hút khử/i.test(it.role));
  const hasDishwasher = referencedItems.some((it) => /rửa chén|rửa bát/i.test(it.role));
  const hasOven = referencedItems.some((it) => /lò nướng/i.test(it.role));
  const hasMicrowave = referencedItems.some((it) => /vi sóng|microwave/i.test(it.role));
  const hasSteam = referencedItems.some((it) => /hấp|steam/i.test(it.role));
  const hasWine = referencedItems.some((it) => /tủ rượu|wine/i.test(it.role));
  const hasBuiltinMicrowave =
    hasMicrowave &&
    referencedItems.some(
      (it) =>
        /vi sóng|microwave/i.test(it.role) &&
        /âm tủ|built.in|bel|bfl/i.test(`${it.role} ${resolveItemName(it)}`),
    );
  const hasIntegratedDw = referencedItems.some(
    (it) =>
      /rửa chén|rửa bát/i.test(it.role) &&
      (/âm toàn phần|fully integrated|toàn phần/i.test(`${it.role} ${resolveItemName(it)}`) ||
        /^smv/i.test(it.sku || "")),
  );
  const hasIslandHood = referencedItems.some((it) => {
    if (!/hút mùi|hút khử/i.test(it.role)) return false;
    const n = resolveItemName(it).toLowerCase();
    const s = (it.sku || "").toLowerCase();
    return /đảo|island/.test(n) || /^dib|^dia/.test(s);
  });
  const hasSlimHood = referencedItems.some((it) => {
    if (!/hút mùi|hút khử/i.test(it.role)) return false;
    const n = resolveItemName(it).toLowerCase();
    const s = (it.sku || "").toLowerCase();
    return /slim|âm tủ|under.cabinet|kéo trượt/.test(n) || /^dft|^dhi/.test(s);
  });

  // Layout có thể bị override khi có island hood (không thể wall-mount island hood).
  const effectiveLayoutDesc = hasIslandHood ? LAYOUT_DESC_WITH_ISLAND[layout] : LAYOUT_DESC[layout];
  const effectiveCamera = CAMERA_DESC[layout];

  // Zone organization với island override.
  const effectiveZoneOrg = hasIslandHood
    ? `Place the cooktop on the CENTRAL ISLAND below the suspended island rangehood. ${ZONE_ORG[layout].replace(/cooking zone \(cooktop \+ rangehood[^)]*\)/i, "cooking zone (cooktop now on the central island)")}`
    : ZONE_ORG[layout];

  // Đếm số thiết bị "âm tủ" để hướng dẫn cột tủ cao đứng.
  const tallColumnCount = (hasOven ? 1 : 0) + (hasBuiltinMicrowave ? 1 : 0) + (hasSteam ? 1 : 0);
  const tallColumnInstr =
    tallColumnCount === 1
      ? "The tall storage cabinet column contains EXACTLY ONE built-in appliance from the list. Fill ALL the remaining space in the column (above and below it) with plain matching cabinet doors only — do NOT add any additional oven, microwave, steam oven or warming drawer that is not in the reference list."
      : tallColumnCount >= 2
      ? `The tall storage cabinet column contains EXACTLY ${tallColumnCount} built-in appliances from the list, stacked vertically. Fill ALL the remaining space in the column with plain matching cabinet doors only — do NOT invent additional built-in appliances above, below, or between them.`
      : "Do NOT add any built-in oven, microwave, steam oven or warming drawer anywhere in this kitchen — none are in the reference list. The tall storage column, if any, must contain only plain matching cabinet doors and drawers.";

  // Câu cấm rõ ràng cho từng thiết bị KHÔNG có trong combo (chống AI auto-add).
  const absences: string[] = [];
  if (!hasOven) absences.push("NO oven (no built-in oven, no countertop oven, no oven door anywhere)");
  if (!hasMicrowave) absences.push("NO microwave (no built-in microwave, no countertop microwave, no microwave-style small door above the oven)");
  if (!hasSteam) absences.push("NO steam oven, NO warming drawer, NO combi-steam");
  if (!hasDishwasher) absences.push("NO dishwasher");
  if (!hasWine) absences.push("NO wine cooler, NO beverage fridge");
  absences.push("NO refrigerator unless listed", "NO coffee machine unless listed", "NO under-counter trash compactor");

  const negatives: string[] = [
    "render EXACTLY one of each appliance listed and nothing else",
    "no extra cooktop, no second rangehood, no extra sink, no extra faucet",
    "no people, no text overlays, no logos beyond what is already on the reference appliances",
  ];
  if (hasInduction) negatives.push("the cooktop is INDUCTION — no gas burners, no grates, no knobs, no flame");
  if (hasOven && !hasMicrowave)
    negatives.push("there is ONLY ONE oven in this kitchen — do NOT stack a microwave-looking small appliance above or below it, do NOT duplicate the oven");
  if (hasOven && hasMicrowave)
    negatives.push("the oven and the microwave must look clearly different in size (oven is taller and larger) — do NOT render two ovens of similar size");
  if (hasBuiltinMicrowave)
    negatives.push("a countertop microwave is NOT acceptable — the microwave must be flush-mounted inside the cabinet column");
  if (hasIntegratedDw)
    negatives.push("the integrated dishwasher must have NO visible appliance front and NO brand badge — only a matching cabinet panel");
  if (hasIslandHood)
    negatives.push("the rangehood is SUSPENDED FROM THE CEILING by metal cables or a thin rod above the central island, with NO contact to any wall — do NOT wall-mount it");
  if (hasSlimHood)
    negatives.push("the rangehood is hidden INSIDE the upper wall cabinet (only its front control strip and pull-out slider visible) — do NOT render a chimney, do NOT render a canopy, NO duct above");
  if (hasHood && !hasIslandHood && !hasSlimHood && !referencedItems.some((it) => /hút mùi/i.test(it.role) && /pyramid|tháp|chimney|treo tường|kim cương/i.test(resolveItemName(it))))
    negatives.push("the rangehood matches the reference's exact form factor — do NOT swap a T-shape canopy for a pyramid chimney or vice versa");

  const absenceLine = `Strictly absent items (do NOT render any of these even though they are common in kitchens): ${absences.join("; ")}.`;

  return [
    // === MỞ ĐẦU: tuyên ngôn về reference làm chuẩn ===
    `GROUND-TRUTH MANDATE: The attached reference product images are the absolute ground truth. The prose below is secondary guidance — when in doubt, follow the references' exact shape / proportions / finish / colors / brand badges over any text description.`,

    // === BỐI CẢNH ===
    `Compose a professional architectural interior photograph of a ${houseHint}.`,

    // === LAYOUT — ép buộc 2 lần ===
    `LAYOUT (mandatory, do NOT substitute with another layout): ${effectiveLayoutDesc}.`,
    `Camera: ${effectiveCamera}.`,

    // === STYLE — ép buộc cabinet rule ===
    `DESIGN STYLE (mandatory): ${STYLE_DESC[style]}. ${CABINETRY_RULE[style]}`,
    fengShuiHint ? `Color palette adjustment: ${fengShuiHint}.` : "",

    // === SPATIAL ORG ===
    `Spatial organization: ${effectiveZoneOrg}`,

    // === ĐẶT THIẾT BỊ ===
    `Place the appliances shown in the reference images into the kitchen, in this order: ${placements}.`,

    // === FIDELITY DIRECTIVE ===
    `For each appliance, replicate its reference image 1:1 — same shape, same proportions, same finish color, same surface texture, same panel layout, same control buttons, same brand badge position. Mentally rotate each reference to match the kitchen viewing angle but preserve every proportion. Apply the kitchen's daylight, warm color grading and depth of field to every appliance so it looks photographed in place, not pasted from a catalog. Keep edges of metallic appliances crisp against the cabinetry — do not let them blend in.`,

    // === COLUMN + FIXTURE + ABSENCE + NEGATIVES ===
    `Tall storage column rule: ${tallColumnInstr}`,
    fixtureBlock,
    absenceLine,
    `Constraints: ${negatives.join("; ")}.`,

    // === LAYOUT REINFORCEMENT (lặp lại lần 2, gpt-image-1 cần repetition) ===
    `Final layout reminder: this kitchen MUST be a ${LAYOUTS.find((l) => l.id === layout)?.label || layout} — ${effectiveLayoutDesc}. Do NOT render it as a different layout shape even if the references suggest otherwise.`,

    // === PHOTO QUALITY ===
    `Photorealistic magazine-quality interior photography, sharp focus on every appliance detail, natural perspective, balanced soft daylight, 8K, color-graded warm and inviting.`,
  ]
    .filter(Boolean)
    .join(" ");
}
