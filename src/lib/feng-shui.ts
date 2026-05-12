/**
 * Tính ngũ hành nạp âm (Vietnamese feng shui) từ năm sinh + giới tính.
 * Dùng bảng nạp âm 60 năm chu kỳ Giáp Tý (1924) đến Quý Hợi (1983) rồi lặp.
 *
 * Mệnh → gợi ý hướng bếp, màu sắc, chất liệu, cây xanh — dùng cho:
 *  1) UI feng-shui card trong WizardResult
 *  2) Inject vào prompt AI image generation
 */
export type Element = "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho";

/** Bảng 60 nạp âm — mỗi cặp 2 năm chung 1 nạp âm */
const NAPAM_60: { name: string; element: Element }[] = [
  { name: "Hải Trung Kim", element: "Kim" },    // 0: Giáp Tý 1924
  { name: "Hải Trung Kim", element: "Kim" },    // 1: Ất Sửu
  { name: "Lư Trung Hỏa", element: "Hoa" },     // 2: Bính Dần
  { name: "Lư Trung Hỏa", element: "Hoa" },     // 3: Đinh Mão
  { name: "Đại Lâm Mộc", element: "Moc" },      // 4: Mậu Thìn
  { name: "Đại Lâm Mộc", element: "Moc" },      // 5: Kỷ Tỵ
  { name: "Lộ Bàng Thổ", element: "Tho" },      // 6: Canh Ngọ
  { name: "Lộ Bàng Thổ", element: "Tho" },      // 7: Tân Mùi
  { name: "Kiếm Phong Kim", element: "Kim" },   // 8: Nhâm Thân
  { name: "Kiếm Phong Kim", element: "Kim" },   // 9: Quý Dậu
  { name: "Sơn Đầu Hỏa", element: "Hoa" },      // 10: Giáp Tuất
  { name: "Sơn Đầu Hỏa", element: "Hoa" },      // 11: Ất Hợi
  { name: "Giản Hạ Thủy", element: "Thuy" },    // 12: Bính Tý
  { name: "Giản Hạ Thủy", element: "Thuy" },    // 13: Đinh Sửu
  { name: "Thành Đầu Thổ", element: "Tho" },    // 14: Mậu Dần
  { name: "Thành Đầu Thổ", element: "Tho" },    // 15: Kỷ Mão
  { name: "Bạch Lạp Kim", element: "Kim" },     // 16: Canh Thìn
  { name: "Bạch Lạp Kim", element: "Kim" },     // 17: Tân Tỵ
  { name: "Dương Liễu Mộc", element: "Moc" },   // 18: Nhâm Ngọ
  { name: "Dương Liễu Mộc", element: "Moc" },   // 19: Quý Mùi
  { name: "Tuyền Trung Thủy", element: "Thuy" },// 20: Giáp Thân
  { name: "Tuyền Trung Thủy", element: "Thuy" },// 21: Ất Dậu
  { name: "Ốc Thượng Thổ", element: "Tho" },    // 22: Bính Tuất
  { name: "Ốc Thượng Thổ", element: "Tho" },    // 23: Đinh Hợi
  { name: "Tích Lịch Hỏa", element: "Hoa" },    // 24: Mậu Tý
  { name: "Tích Lịch Hỏa", element: "Hoa" },    // 25: Kỷ Sửu
  { name: "Tùng Bách Mộc", element: "Moc" },    // 26: Canh Dần
  { name: "Tùng Bách Mộc", element: "Moc" },    // 27: Tân Mão
  { name: "Trường Lưu Thủy", element: "Thuy" }, // 28: Nhâm Thìn
  { name: "Trường Lưu Thủy", element: "Thuy" }, // 29: Quý Tỵ
  { name: "Sa Trung Kim", element: "Kim" },     // 30: Giáp Ngọ
  { name: "Sa Trung Kim", element: "Kim" },     // 31: Ất Mùi
  { name: "Sơn Hạ Hỏa", element: "Hoa" },       // 32: Bính Thân
  { name: "Sơn Hạ Hỏa", element: "Hoa" },       // 33: Đinh Dậu
  { name: "Bình Địa Mộc", element: "Moc" },     // 34: Mậu Tuất
  { name: "Bình Địa Mộc", element: "Moc" },     // 35: Kỷ Hợi
  { name: "Bích Thượng Thổ", element: "Tho" },  // 36: Canh Tý
  { name: "Bích Thượng Thổ", element: "Tho" },  // 37: Tân Sửu
  { name: "Kim Bạch Kim", element: "Kim" },     // 38: Nhâm Dần
  { name: "Kim Bạch Kim", element: "Kim" },     // 39: Quý Mão
  { name: "Phú Đăng Hỏa", element: "Hoa" },     // 40: Giáp Thìn
  { name: "Phú Đăng Hỏa", element: "Hoa" },     // 41: Ất Tỵ
  { name: "Thiên Hà Thủy", element: "Thuy" },   // 42: Bính Ngọ
  { name: "Thiên Hà Thủy", element: "Thuy" },   // 43: Đinh Mùi
  { name: "Đại Trạch Thổ", element: "Tho" },    // 44: Mậu Thân
  { name: "Đại Trạch Thổ", element: "Tho" },    // 45: Kỷ Dậu
  { name: "Thoa Xuyến Kim", element: "Kim" },   // 46: Canh Tuất
  { name: "Thoa Xuyến Kim", element: "Kim" },   // 47: Tân Hợi
  { name: "Tang Đố Mộc", element: "Moc" },      // 48: Nhâm Tý
  { name: "Tang Đố Mộc", element: "Moc" },      // 49: Quý Sửu
  { name: "Đại Khê Thủy", element: "Thuy" },    // 50: Giáp Dần
  { name: "Đại Khê Thủy", element: "Thuy" },    // 51: Ất Mão
  { name: "Sa Trung Thổ", element: "Tho" },     // 52: Bính Thìn
  { name: "Sa Trung Thổ", element: "Tho" },     // 53: Đinh Tỵ
  { name: "Thiên Thượng Hỏa", element: "Hoa" }, // 54: Mậu Ngọ
  { name: "Thiên Thượng Hỏa", element: "Hoa" }, // 55: Kỷ Mùi
  { name: "Thạch Lựu Mộc", element: "Moc" },    // 56: Canh Thân
  { name: "Thạch Lựu Mộc", element: "Moc" },    // 57: Tân Dậu
  { name: "Đại Hải Thủy", element: "Thuy" },    // 58: Nhâm Tuất
  { name: "Đại Hải Thủy", element: "Thuy" },    // 59: Quý Hợi 1983
];

export type FengShuiResult = {
  element: Element;
  elementVi: string;          // "Kim" / "Mộc" / ...
  napam: string;              // "Hải Trung Kim"
  description: string;
  goodDirections: string[];
  badDirections: string[];
  colors: { vi: string; en: string; hex: string }[];
  materials: string[];
  /** Đoạn mô tả màu sắc bằng tiếng Anh dùng nhúng vào prompt AI */
  aiStyleHint: string;
};

const META: Record<Element, Omit<FengShuiResult, "element" | "napam">> = {
  Kim: {
    elementVi: "Kim",
    description:
      "Người mệnh Kim mạnh mẽ, quyết đoán. Bếp hợp mệnh nên dùng tông kim loại sáng, đá trắng và bố trí gọn gàng, đường nét sắc sảo.",
    goodDirections: ["Tây", "Tây Bắc"],
    badDirections: ["Đông", "Đông Nam"],
    colors: [
      { vi: "Trắng tinh", en: "pure white", hex: "#FFFFFF" },
      { vi: "Bạc / Ánh kim", en: "metallic silver", hex: "#C0C0C0" },
      { vi: "Xám trắng", en: "soft grey", hex: "#D6D6D6" },
      { vi: "Vàng đất (tương sinh)", en: "warm earth yellow", hex: "#D4B895" },
    ],
    materials: ["Inox xước", "Đá marble trắng vân mây", "Đá granite trắng", "Kính trong"],
    aiStyleHint:
      "color palette dominated by pure white, polished stainless steel, soft grey, and matte silver accents; clean linear cabinetry; marble or quartz countertop with subtle veining",
  },
  Moc: {
    elementVi: "Mộc",
    description:
      "Người mệnh Mộc sáng tạo, vươn lên. Bếp hợp mệnh ưu tiên gỗ tự nhiên, cây xanh và ánh sáng tự nhiên dồi dào.",
    goodDirections: ["Đông", "Đông Nam"],
    badDirections: ["Tây", "Tây Bắc"],
    colors: [
      { vi: "Xanh lá", en: "natural green", hex: "#4A7C59" },
      { vi: "Xanh rêu", en: "moss green", hex: "#3B5D3B" },
      { vi: "Gỗ sáng", en: "light oak wood", hex: "#C8A879" },
      { vi: "Đen tuyền (tương sinh)", en: "deep black accent", hex: "#1B1B1B" },
    ],
    materials: ["Gỗ sồi trắng", "Gỗ tần bì", "Đá granite xanh", "Veneer vân gỗ"],
    aiStyleHint:
      "color palette of light oak wood, sage green, and deep forest green accents; visible wood grain on cabinets; potted herbs on the counter near the window; abundant natural daylight",
  },
  Thuy: {
    elementVi: "Thủy",
    description:
      "Người mệnh Thủy linh hoạt, sâu sắc. Bếp hợp mệnh nên dùng tông xanh dương sâu, đen ánh, và kết hợp ánh kim làm điểm nhấn.",
    goodDirections: ["Bắc", "Đông Nam"],
    badDirections: ["Nam", "Tây Nam", "Đông Bắc"],
    colors: [
      { vi: "Xanh navy", en: "navy blue", hex: "#1E3A5F" },
      { vi: "Đen tuyền", en: "deep black", hex: "#0D0D0D" },
      { vi: "Xanh lam đậm", en: "deep ocean blue", hex: "#0B4F6C" },
      { vi: "Trắng/Bạc (tương sinh)", en: "silver white", hex: "#E5E5E5" },
    ],
    materials: ["Đá marble đen", "Đá granite xanh đen", "Inox gương", "Kính cường lực đen"],
    aiStyleHint:
      "color palette of deep navy blue and matte black cabinets with brushed nickel handles; black quartz countertop with white veining; subtle silver accents; moody ambient lighting",
  },
  Hoa: {
    elementVi: "Hỏa",
    description:
      "Người mệnh Hỏa nhiệt huyết, năng động. Bếp hợp mệnh nên có điểm nhấn đỏ - cam ấm, gỗ đậm, và đèn tone vàng ấm.",
    goodDirections: ["Nam", "Đông", "Đông Nam"],
    badDirections: ["Bắc"],
    colors: [
      { vi: "Đỏ burgundy", en: "burgundy red", hex: "#7B2D26" },
      { vi: "Cam đất", en: "terracotta orange", hex: "#C45D3A" },
      { vi: "Hồng đào", en: "warm coral", hex: "#E08E79" },
      { vi: "Xanh lá (tương sinh)", en: "deep green accent", hex: "#2D5016" },
    ],
    materials: ["Đá marble đỏ rosso", "Gỗ óc chó đậm", "Đồng (copper) ánh đỏ", "Gạch terracotta"],
    aiStyleHint:
      "color palette of warm terracotta, burgundy red accents, and walnut wood cabinets; brass and copper hardware; warm tungsten pendant lights; cozy inviting atmosphere",
  },
  Tho: {
    elementVi: "Thổ",
    description:
      "Người mệnh Thổ ổn định, đáng tin. Bếp hợp mệnh nên dùng tông vàng đất, be, nâu ấm, vật liệu đá tự nhiên dày dặn.",
    goodDirections: ["Đông Bắc", "Tây Nam"],
    badDirections: ["Đông", "Đông Nam"],
    colors: [
      { vi: "Vàng đất", en: "warm earth yellow", hex: "#C9A66B" },
      { vi: "Be kem", en: "cream beige", hex: "#E8DCC4" },
      { vi: "Nâu cát", en: "sand brown", hex: "#A07856" },
      { vi: "Đỏ đất (tương sinh)", en: "earthy red", hex: "#8B3A2F" },
    ],
    materials: ["Đá travertine", "Gạch terrazzo", "Gỗ teak", "Đá sa thạch"],
    aiStyleHint:
      "color palette of warm beige, sand, and earthy yellow tones; travertine or terrazzo countertop; oak cabinets in natural finish; soft warm sunset lighting from a window",
  },
};

/**
 * Tính mệnh từ năm sinh dương lịch.
 * Quy ước đơn giản: dùng năm dương trừ 1924 modulo 60.
 * (Chính xác hơn cần biết tháng/ngày để chuyển sang âm lịch, nhưng đa số người
 * sinh sau tháng 2 thì năm âm = năm dương — đủ cho UX.)
 */
export function calculateFengShui(year: number, _gender?: "nam" | "nu"): FengShuiResult | null {
  if (!year || year < 1900 || year > 2100) return null;
  const idx = ((year - 1924) % 60 + 60) % 60;
  const napam = NAPAM_60[idx];
  const meta = META[napam.element];
  return {
    element: napam.element,
    napam: napam.name,
    ...meta,
  };
}
