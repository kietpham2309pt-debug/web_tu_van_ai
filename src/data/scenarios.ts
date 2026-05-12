import type { Scenario } from "@/types";

/**
 * 12 kịch bản combo BNB Sales Playbook
 * Mapping (loại nhà × ngân sách × ưu tiên) → kịch bản
 *
 * Nguồn: BNB_Sales_Playbook.docx · Phần 4
 * SKU tham chiếu trùng với data Haravan (bepngocbao.vn) — script fetch sẽ
 * map SKU → product thật để hiển thị ảnh và giá realtime.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "KB-01",
    title: "Chung cư · Ngân sách dưới 30 triệu",
    customer:
      "Cặp vợ chồng trẻ, căn hộ 50-80m², lần đầu mua bếp · Ưu tiên giá tốt nhưng vẫn an toàn",
    filters: {
      houseTypes: ["chung-cu"],
      budgetMin: 0,
      budgetMax: 30_000_000,
      priorities: ["gia-tot", "can-bang"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 14_889_000,
        items: [
          { sku: "SP 09", fallbackName: "Spelier SP 09 - bếp đơn", role: "Bếp từ", refPrice: 720_000 },
          { sku: "K-6070V", fallbackName: "Kocher K-6070V 70cm", role: "Máy hút mùi", refPrice: 2_100_000 },
          { sku: "Tari 400SM", fallbackName: "Konox Tari 400SM", role: "Chậu rửa", refPrice: 3_557_000 },
          { sku: "Reno Smart", fallbackName: "Konox Reno Smart", role: "Vòi rửa", refPrice: 2_332_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 22_429_000,
        items: [
          { sku: "EU-T685 Max", fallbackName: "Eurosun EU-T685 Max - bếp đôi", role: "Bếp từ", refPrice: 4_920_000 },
          { sku: "K-8872V", fallbackName: "Kocher K-8872V 70cm", role: "Máy hút mùi", refPrice: 3_600_000 },
          { sku: "Tari 5744SM", fallbackName: "Konox Tari 5744SM", role: "Chậu rửa", refPrice: 4_017_000 },
          { sku: "Vira Chrome", fallbackName: "Konox Vira Chrome", role: "Vòi rửa", refPrice: 3_081_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 28_645_000,
        items: [
          { sku: "DI-633", fallbackName: "Kocher DI-633 - bếp đôi", role: "Bếp từ", refPrice: 5_040_000 },
          { sku: "K-2080V", fallbackName: "Kocher K-2080V 70cm", role: "Máy hút mùi", refPrice: 8_340_000 },
          { sku: "Tari 6448SM", fallbackName: "Konox Tari 6448SM", role: "Chậu rửa", refPrice: 5_187_000 },
          { sku: "Lasi Chrome", fallbackName: "Konox Lasi Chrome", role: "Vòi rửa", refPrice: 3_518_000 },
        ],
      },
    ],
    reasoning: [
      "Vừa đủ cho căn hộ 50-80m² 2 người · không mua thừa tính năng",
      "Cả 4 sản phẩm đều có bảo hành chính hãng tối thiểu 2 năm",
      "Konox đồng bộ chậu + vòi → thẩm mỹ tốt hơn mua rời",
      "Phương án B có bếp đôi - phù hợp khi gia đình tăng người sau này",
    ],
    pitchExample:
      "Nhà anh chị 2 người, căn hộ 70m² thì combo B này là tối ưu. Bếp đôi Eurosun đủ cho gia đình 4 người sau này, hút mùi Kocher 70cm vừa với độ rộng tủ chung cư, và Konox thì đồng bộ luôn chậu + vòi - 5-10 năm sau anh chị vẫn cảm thấy bếp đẹp.",
  },
  {
    id: "KB-02",
    title: "Chung cư · Ngân sách 30-60 triệu",
    customer:
      "Gia đình 3-4 người, căn hộ 80-100m² · Ưu tiên cân bằng giữa thương hiệu và tính năng",
    filters: {
      houseTypes: ["chung-cu"],
      budgetMin: 30_000_000,
      budgetMax: 60_000_000,
      priorities: ["can-bang", "ben-cao-cap"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 32_889_000,
        items: [
          { sku: "DI-633", fallbackName: "Kocher DI-633 - bếp đôi", role: "Bếp từ", refPrice: 5_040_000 },
          { sku: "K-2080V", fallbackName: "Kocher K-2080V 70cm", role: "Máy hút mùi", refPrice: 8_340_000 },
          { sku: "X10", fallbackName: "Kocher X10 9 bộ", role: "Máy rửa chén", refPrice: 9_840_000 },
          { sku: "Tari 6448SM", fallbackName: "Konox Tari 6448SM", role: "Chậu rửa", refPrice: 5_187_000 },
          { sku: "Lumo Smart Chrome", fallbackName: "Konox Lumo Smart Chrome", role: "Vòi rửa", refPrice: 3_104_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 41_859_000,
        items: [
          { sku: "SPE IC 1288 DE", fallbackName: "Spelier SPE IC 1288 DE - bếp đôi", role: "Bếp từ", refPrice: 17_100_000 },
          { sku: "SP 109SO", fallbackName: "Spelier SP 109SO", role: "Máy hút mùi", refPrice: 5_232_000 },
          { sku: "SP 08 PLUS1DW", fallbackName: "Spelier SP 08 PLUS1DW", role: "Máy rửa chén", refPrice: 10_740_000 },
          { sku: "Tari 7851SM", fallbackName: "Konox Tari 7851SM", role: "Chậu rửa", refPrice: 6_224_000 },
          { sku: "Stream Smart Nude", fallbackName: "Konox Stream Smart Nude", role: "Vòi rửa", refPrice: 3_869_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 55_596_000,
        items: [
          { sku: "PUC631BB5E", fallbackName: "Bosch PUC631BB5E - bếp đôi", role: "Bếp từ", refPrice: 9_480_000 },
          { sku: "DFT63CA61B", fallbackName: "Bosch DFT63CA61B", role: "Máy hút mùi", refPrice: 5_220_000 },
          { sku: "SMS4HMI07E", fallbackName: "Bosch SMS4HMI07E - 13 bộ", role: "Máy rửa chén", refPrice: 16_680_000 },
          { sku: "KN8044SU Linen", fallbackName: "Konox KN8044SU Linen", role: "Chậu rửa", refPrice: 7_012_000 },
          { sku: "Stream Smart Black", fallbackName: "Konox Stream Smart Black", role: "Vòi rửa", refPrice: 4_103_000 },
        ],
      },
    ],
    reasoning: [
      "Có thêm máy rửa chén - thay đổi lớn nhất cho chất lượng sống của gia đình 4 người",
      "Phương án B cân bằng nhất: bếp Spelier xuất xứ Đức, hút mùi cùng hãng đồng bộ thẩm mỹ",
      "Phương án C có Bosch - lựa chọn an tâm nhất cho khách quan tâm thương hiệu",
      "Tất cả máy rửa chén đều ≥9 bộ - đủ cho gia đình 4 người + nồi xoong",
    ],
    pitchExample:
      "Gia đình 4 người mà có máy rửa chén thì 5 năm sau anh chị sẽ thấy đó là quyết định đúng nhất. Combo B Spelier xuất xứ Đức, đồng bộ bếp + hút mùi + rửa chén cùng hãng - vừa đẹp vừa an tâm dịch vụ về sau.",
  },
  {
    id: "KB-03",
    title: "Chung cư cao cấp · Ngân sách 60-100 triệu",
    customer:
      "Gia đình trẻ thu nhập cao, penthouse hoặc căn hộ cao cấp · Ưu tiên thương hiệu và độ bền",
    filters: {
      houseTypes: ["chung-cu", "biet-thu"],
      budgetMin: 60_000_000,
      budgetMax: 100_000_000,
      priorities: ["ben-cao-cap", "thuong-hieu-duc"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 60_739_000,
        items: [
          { sku: "PUC64RAA5E", fallbackName: "Bosch PUC64RAA5E - bếp đôi", role: "Bếp từ", refPrice: 9_600_000 },
          { sku: "DFT93AC50", fallbackName: "Bosch DFT93AC50", role: "Máy hút mùi", refPrice: 6_480_000 },
          { sku: "SMS4HTI16E", fallbackName: "Bosch SMS4HTI16E", role: "Máy rửa chén", refPrice: 15_720_000 },
          { sku: "BFL524MB2", fallbackName: "Bosch BFL524MB2", role: "Lò vi sóng", refPrice: 12_780_000 },
          { sku: "KN8048SU Linen", fallbackName: "Konox KN8048SU Linen", role: "Chậu rửa", refPrice: 7_012_000 },
          { sku: "Lasi Gun Metal", fallbackName: "Konox Lasi Gun Metal", role: "Vòi rửa", refPrice: 3_799_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 75_756_000,
        items: [
          { sku: "PID675DC1E", fallbackName: "Bosch PID675DC1E - bếp đôi", role: "Bếp từ", refPrice: 14_400_000 },
          { sku: "DWB67BK61T", fallbackName: "Bosch DWB67BK61T - hút mùi đảo", role: "Máy hút mùi", refPrice: 7_560_000 },
          { sku: "SMS4HCI48E", fallbackName: "Bosch SMS4HCI48E", role: "Máy rửa chén", refPrice: 18_600_000 },
          { sku: "BEL524MB2", fallbackName: "Bosch BEL524MB2", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "Tari Smart 8047", fallbackName: "Konox Tari Smart 8047", role: "Chậu rửa", refPrice: 7_699_000 },
          { sku: "Kira Chrome", fallbackName: "Konox Kira Chrome", role: "Vòi rửa", refPrice: 4_173_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 96_540_000,
        items: [
          { sku: "PVQ61RHB1E", fallbackName: "Bosch PVQ61RHB1E - bếp đôi", role: "Bếp từ", refPrice: 18_960_000 },
          { sku: "DWB97BK61T", fallbackName: "Bosch DWB97BK61T", role: "Máy hút mùi", refPrice: 9_720_000 },
          { sku: "SMS6ZCI01P", fallbackName: "Bosch SMS6ZCI01P", role: "Máy rửa chén", refPrice: 21_000_000 },
          { sku: "BEL554MB2", fallbackName: "Bosch BEL554MB2", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "KN8644SU Dekor", fallbackName: "Konox KN8644SU Dekor", role: "Chậu rửa", refPrice: 8_245_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
    ],
    reasoning: [
      "Toàn bộ Bosch - thương hiệu Đức số 1 thế giới về bếp âm, bảo hành 3 năm chính hãng",
      "Đồng bộ design: tất cả thiết bị Bosch cùng dòng → tủ bếp âm gọn, không lệch tay",
      "Phương án B có hút mùi đảo (DWB67) - phù hợp bếp đảo của penthouse",
      "Lò vi sóng âm tủ thay vì đặt mặt - tăng diện tích bàn bếp 15-20%",
    ],
    pitchExample:
      "Anh chị ở penthouse mà tủ bếp không đồng bộ thì rất tiếc. Combo B Bosch full - 5 thiết bị cùng dòng, lắp âm tủ gọn gàng, 10 năm sau anh chị vẫn không bị lỗi mốt.",
  },
  {
    id: "KB-04",
    title: "Nhà phố · Ngân sách dưới 50 triệu",
    customer:
      "Nhà phố 100-150m², gia đình 3-5 người · Ưu tiên giá tốt nhưng đầy đủ thiết bị",
    filters: {
      houseTypes: ["nha-pho"],
      budgetMin: 0,
      budgetMax: 50_000_000,
      priorities: ["gia-tot", "can-bang"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 26_793_000,
        items: [
          { sku: "EU-T685 Max", fallbackName: "Eurosun EU-T685 Max - đôi", role: "Bếp từ", refPrice: 4_920_000 },
          { sku: "SP 70AH", fallbackName: "Spelier SP 70AH", role: "Máy hút mùi", refPrice: 2_784_000 },
          { sku: "SMS60E08EB", fallbackName: "Eurosun SMS60E08EB - 8 bộ", role: "Máy rửa chén", refPrice: 11_016_000 },
          { sku: "Tari 5744SM", fallbackName: "Konox Tari 5744SM", role: "Chậu rửa", refPrice: 4_017_000 },
          { sku: "Vira Chrome", fallbackName: "Konox Vira Chrome", role: "Vòi rửa", refPrice: 3_081_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 36_540_000,
        items: [
          { sku: "DI-220", fallbackName: "Kocher DI-220 - đôi", role: "Bếp từ", refPrice: 5_280_000 },
          { sku: "K-225C Pro", fallbackName: "Kocher K-225C Pro 90cm", role: "Máy hút mùi", refPrice: 7_080_000 },
          { sku: "DWJ-100", fallbackName: "Junger DWJ-100", role: "Máy rửa chén", refPrice: 11_388_000 },
          { sku: "Tari 7851SM", fallbackName: "Konox Tari 7851SM", role: "Chậu rửa", refPrice: 6_224_000 },
          { sku: "Stream Smart Chrome", fallbackName: "Konox Stream Smart Chrome", role: "Vòi rửa", refPrice: 3_845_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 44_640_000,
        items: [
          { sku: "SPE IC 1288 DE", fallbackName: "Spelier SPE IC 1288 DE - đôi", role: "Bếp từ", refPrice: 17_100_000 },
          { sku: "K-2080V", fallbackName: "Kocher K-2080V 90cm", role: "Máy hút mùi", refPrice: 8_700_000 },
          { sku: "DWJ-450", fallbackName: "Junger DWJ-450", role: "Máy rửa chén", refPrice: 11_628_000 },
          { sku: "KN8044SU Linen", fallbackName: "Konox KN8044SU Linen", role: "Chậu rửa", refPrice: 7_012_000 },
          { sku: "Lasi Nude", fallbackName: "Konox Lasi Nude", role: "Vòi rửa", refPrice: 3_604_000 },
        ],
      },
    ],
    reasoning: [
      "Hút mùi 90cm phù hợp tủ bếp nhà phố (rộng hơn chung cư)",
      "Máy rửa chén tối thiểu 8 bộ cho gia đình đông người",
      "Phương án B có Junger Thái Lan - thương hiệu đáng tin với giá hợp lý",
      "Phương án C có bếp Spelier Đức - vừa với tầm tiền khách muốn thương hiệu",
    ],
    pitchExample:
      "Nhà phố mà có máy rửa chén thì cuộc sống thay đổi hẳn. Combo B này em hay đề xuất nhất cho gia đình 5 người - vừa đủ ngân sách 40 triệu, mà vẫn có hút mùi 90cm và máy rửa chén Junger Thái Lan đáng tin.",
  },
  {
    id: "KB-05",
    title: "Nhà phố · Ngân sách 50-80 triệu",
    customer:
      "Gia đình 4-6 người, nhà phố 150-250m², bếp là không gian chung · Cân bằng đẹp - bền - tính năng",
    filters: {
      houseTypes: ["nha-pho"],
      budgetMin: 50_000_000,
      budgetMax: 80_000_000,
      priorities: ["can-bang", "ben-cao-cap"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 50_343_000,
        items: [
          { sku: "PUC631BB5E", fallbackName: "Bosch PUC631BB5E - đôi", role: "Bếp từ", refPrice: 9_480_000 },
          { sku: "DFT63CA61B", fallbackName: "Bosch DFT63CA61B", role: "Máy hút mùi", refPrice: 5_220_000 },
          { sku: "SP 08 PLUS1DW", fallbackName: "Spelier SP 08 PLUS1DW", role: "Máy rửa chén", refPrice: 10_740_000 },
          { sku: "KMEU-1025A", fallbackName: "Kocher KMEU-1025A - lò nướng", role: "Lò nướng", refPrice: 8_460_000 },
          { sku: "Tari 7851SM", fallbackName: "Konox Tari 7851SM", role: "Chậu rửa", refPrice: 6_224_000 },
          { sku: "Lasi Chrome", fallbackName: "Konox Lasi Chrome", role: "Vòi rửa", refPrice: 3_518_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 65_840_000,
        items: [
          { sku: "PID651DC5E", fallbackName: "Bosch PID651DC5E - đôi", role: "Bếp từ", refPrice: 16_200_000 },
          { sku: "DFT93AC50", fallbackName: "Bosch DFT93AC50", role: "Máy hút mùi", refPrice: 6_480_000 },
          { sku: "SMS4HMI07E", fallbackName: "Bosch SMS4HMI07E - 13 bộ", role: "Máy rửa chén", refPrice: 16_680_000 },
          { sku: "SP O72P", fallbackName: "Spelier SP O72P - lò nướng", role: "Lò nướng", refPrice: 10_800_000 },
          { sku: "STELO 780U", fallbackName: "Konox STELO 780U", role: "Chậu rửa", refPrice: 7_394_000 },
          { sku: "Stream Smart Black", fallbackName: "Konox Stream Smart Black", role: "Vòi rửa", refPrice: 4_103_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 79_956_000,
        items: [
          { sku: "PID775DC1E", fallbackName: "Bosch PID775DC1E - đôi", role: "Bếp từ", refPrice: 16_560_000 },
          { sku: "DWB67BK61T", fallbackName: "Bosch DWB67BK61T - đảo", role: "Máy hút mùi", refPrice: 7_560_000 },
          { sku: "SMV4HCX19E", fallbackName: "Bosch SMV4HCX19E - âm toàn phần", role: "Máy rửa chén", refPrice: 20_520_000 },
          { sku: "HBA514BS3", fallbackName: "Bosch HBA514BS3 - lò nướng", role: "Lò nướng", refPrice: 13_320_000 },
          { sku: "KN8644SU Dekor", fallbackName: "Konox KN8644SU Dekor", role: "Chậu rửa", refPrice: 8_245_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
    ],
    reasoning: [
      "Đầy đủ 6 thiết bị - đáp ứng tất cả nhu cầu nấu nướng (bao gồm lò nướng)",
      "Phương án B Bosch full đồng bộ - thẩm mỹ và bền vượt trội",
      "Phương án C có máy rửa chén âm toàn phần - tủ bếp liền lạc, đẹp như nhà mẫu",
      "Konox xuất xứ Hàn Quốc Posco - chậu inox cao cấp không gỉ 20+ năm",
    ],
    pitchExample:
      "Nhà phố lớn của anh chị mà thiếu lò nướng thì rất tiếc. Combo B này có đầy đủ 6 thiết bị Bosch đồng bộ - 10 năm sau vẫn đẹp và vẫn có service tại nhà.",
  },
  {
    id: "KB-06",
    title: "Nhà phố cao cấp · Ngân sách 80-150 triệu",
    customer:
      "Khách trung thượng lưu, nhà phố > 200m² hoặc 2-3 mặt tiền · Ưu tiên cao cấp đồng bộ",
    filters: {
      houseTypes: ["nha-pho", "biet-thu"],
      budgetMin: 80_000_000,
      budgetMax: 150_000_000,
      priorities: ["ben-cao-cap", "thuong-hieu-duc"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 86_124_000,
        items: [
          { sku: "PID675DC1E", fallbackName: "Bosch PID675DC1E", role: "Bếp từ", refPrice: 14_400_000 },
          { sku: "DWB97BK61T", fallbackName: "Bosch DWB97BK61T - 90cm", role: "Máy hút mùi", refPrice: 9_720_000 },
          { sku: "SMS4HMC25M", fallbackName: "Bosch SMS4HMC25M - 14 bộ", role: "Máy rửa chén", refPrice: 16_200_000 },
          { sku: "BFL524MB2", fallbackName: "Bosch BFL524MB2", role: "Lò vi sóng", refPrice: 12_780_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 110_780_000,
        items: [
          { sku: "PVQ61RHB1E", fallbackName: "Bosch PVQ61RHB1E", role: "Bếp từ", refPrice: 18_960_000 },
          { sku: "DFS097A51B", fallbackName: "Bosch DFS097A51B - 90cm", role: "Máy hút mùi", refPrice: 12_600_000 },
          { sku: "SMS6ZCI01P", fallbackName: "Bosch SMS6ZCI01P", role: "Máy rửa chén", refPrice: 21_000_000 },
          { sku: "BEL554MB2", fallbackName: "Bosch BEL554MB2", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 137_280_000,
        items: [
          { sku: "PXE875DC1E", fallbackName: "Bosch PXE875DC1E (Đức)", role: "Bếp từ", refPrice: 29_400_000 },
          { sku: "DFS097K51", fallbackName: "Bosch DFS097K51 (Đức)", role: "Máy hút mùi", refPrice: 19_080_000 },
          { sku: "SMV6ZCX16E", fallbackName: "Bosch SMV6ZCX16E - âm toàn phần", role: "Máy rửa chén", refPrice: 25_800_000 },
          { sku: "BEL7321B1", fallbackName: "Bosch BEL7321B1 (Anh)", role: "Lò vi sóng", refPrice: 28_080_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
    ],
    reasoning: [
      "Toàn bộ Bosch series cao - sản xuất Đức/Anh/Tây Ban Nha (không phải Trung Quốc)",
      "Phương án C có bếp PXE875 - dòng đỉnh của Bosch tại Việt Nam",
      "Lò vi sóng + lò nướng tách rời - đáp ứng khách hay nướng/làm bánh",
      "Bảo hành Bosch 3 năm chính hãng - có service tại nhà toàn quốc",
    ],
    pitchExample:
      "Khách của em đa số khi đầu tư > 100 triệu là muốn 10 năm sau bếp vẫn dùng tốt và vẫn đẹp. Combo B Bosch series 6-8 đáp ứng cả hai. Em không bao giờ tư vấn pha trộn nhiều hãng ở tầm này - vì 5 năm sau dịch vụ một hãng đã đủ phức tạp rồi.",
  },
  {
    id: "KB-07",
    title: "Biệt thự / Penthouse · Trên 150 triệu",
    customer:
      "Khách thượng lưu, biệt thự hoặc penthouse cao cấp · Cao cấp đồng bộ, full Bosch hoặc đa hãng cao cấp",
    filters: {
      houseTypes: ["biet-thu"],
      budgetMin: 150_000_000,
      budgetMax: 1_000_000_000,
      priorities: ["ben-cao-cap", "thuong-hieu-duc"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 153_540_000,
        items: [
          { sku: "PVQ61RHB1E", fallbackName: "Bosch PVQ61RHB1E", role: "Bếp từ", refPrice: 18_960_000 },
          { sku: "DIB98JQ50B", fallbackName: "Bosch DIB98JQ50B - hút mùi đảo", role: "Máy hút mùi", refPrice: 25_200_000 },
          { sku: "SMV6ZCX16E", fallbackName: "Bosch SMV6ZCX16E", role: "Máy rửa chén", refPrice: 25_800_000 },
          { sku: "BEL524MB2", fallbackName: "Bosch BEL524MB2", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 178_840_000,
        items: [
          { sku: "PXE875DC1E", fallbackName: "Bosch PXE875DC1E (Đức)", role: "Bếp từ", refPrice: 29_400_000 },
          { sku: "DIB98JQ50B", fallbackName: "Bosch DIB98JQ50B (đảo · Đức)", role: "Máy hút mùi", refPrice: 25_200_000 },
          { sku: "SMI6ZCS16E", fallbackName: "Bosch SMI6ZCS16E - âm bán phần", role: "Máy rửa chén", refPrice: 26_640_000 },
          { sku: "BEL554MB2", fallbackName: "Bosch BEL554MB2", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 208_500_000,
        items: [
          { sku: "PXE875DC1E", fallbackName: "Bosch PXE875DC1E (Đức)", role: "Bếp từ", refPrice: 29_400_000 },
          { sku: "DIB98JQ50B", fallbackName: "Bosch DIB98JQ50B (đảo · Đức)", role: "Máy hút mùi", refPrice: 25_200_000 },
          { sku: "SMI8ZDS81T", fallbackName: "Bosch SMI8ZDS81T (Đức)", role: "Máy rửa chén", refPrice: 34_200_000 },
          { sku: "BEL7321B1", fallbackName: "Bosch BEL7321B1 (Anh)", role: "Lò vi sóng", refPrice: 28_080_000 },
          { sku: "Vigo 860", fallbackName: "Konox Vigo 860", role: "Chậu rửa", refPrice: 9_118_000 },
          { sku: "Kira Gun Metal", fallbackName: "Konox Kira Gun Metal", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
    ],
    reasoning: [
      "Hút mùi đảo Bosch DIB98JQ50B - tiêu chuẩn cho bếp đảo của biệt thự",
      "Bếp PXE875 và máy rửa chén SMI8ZDS81 - dòng cao nhất của Bosch tại Việt Nam",
      "Toàn bộ thiết bị có thể kết nối Home Connect (smart home) - định danh đẳng cấp",
      "Có thể bổ sung tủ rượu Kocher 15-35tr theo dung tích yêu cầu",
    ],
    pitchExample:
      "Anh chị đầu tư ở tầm này thì BNB sẽ làm khảo sát tận nơi và đề xuất thiết kế bếp đảo full Bosch. Đây là cấp showroom cao nhất - 10 năm sau anh chị vẫn nói được câu 'không có gì để nâng cấp'.",
  },
  {
    id: "KB-08",
    title: "Khách yêu cầu Thương hiệu Đức",
    customer:
      "Khách đã quyết tâm mua hàng Đức · Đẩy mạnh Bosch và Spelier xuất xứ Đức (tránh các SKU Tây Ban Nha / Trung Quốc)",
    filters: {
      houseTypes: ["any"],
      budgetMin: 30_000_000,
      budgetMax: 150_000_000,
      priorities: ["thuong-hieu-duc"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 47_519_000,
        items: [
          { sku: "SPE IC 1288 DE", fallbackName: "Spelier SPE IC 1288 DE (Đức)", role: "Bếp từ", refPrice: 17_100_000 },
          { sku: "SP 109SO", fallbackName: "Spelier SP 109SO", role: "Máy hút mùi", refPrice: 5_232_000 },
          { sku: "SP 16DWKT/B", fallbackName: "Spelier SP 16DWKT/B (Đức)", role: "Máy rửa chén", refPrice: 16_680_000 },
          { sku: "Neron 590U", fallbackName: "Konox Neron 590U", role: "Chậu rửa", refPrice: 6_388_000 },
          { sku: "Vira Chrome", fallbackName: "Konox Vira Chrome", role: "Vòi rửa", refPrice: 3_081_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 60_739_000,
        items: [
          { sku: "PUC64RAA5E", fallbackName: "Bosch PUC64RAA5E (TBN)", role: "Bếp từ", refPrice: 9_600_000 },
          { sku: "DFS067A51B", fallbackName: "Bosch DFS067A51B (Đức)", role: "Máy hút mùi", refPrice: 11_160_000 },
          { sku: "SMS4ECI01P", fallbackName: "Bosch SMS4ECI01P (Đức)", role: "Máy rửa chén", refPrice: 19_440_000 },
          { sku: "KN8048SU Linen", fallbackName: "Konox KN8048SU Linen", role: "Chậu rửa", refPrice: 7_012_000 },
          { sku: "Lasi Nude", fallbackName: "Konox Lasi Nude", role: "Vòi rửa", refPrice: 3_604_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 85_159_000,
        items: [
          { sku: "PXE875DC1E", fallbackName: "Bosch PXE875DC1E (Đức)", role: "Bếp từ", refPrice: 29_400_000 },
          { sku: "DFS097A51B", fallbackName: "Bosch DFS097A51B (Đức)", role: "Máy hút mùi", refPrice: 12_600_000 },
          { sku: "SMS6ZCI02P", fallbackName: "Bosch SMS6ZCI02P (Đức)", role: "Máy rửa chén", refPrice: 21_840_000 },
          { sku: "KN8644SU Dekor", fallbackName: "Konox KN8644SU Dekor", role: "Chậu rửa", refPrice: 8_245_000 },
          { sku: "Kira White", fallbackName: "Konox Kira White", role: "Vòi rửa", refPrice: 4_571_000 },
        ],
      },
    ],
    reasoning: [
      "Phương án A: Spelier xuất xứ Đức - lựa chọn tốt cho khách muốn đồ Đức tầm trung",
      "Phương án B,C: Bosch xuất xứ Đức (không phải Trung Quốc) - phải nói rõ với khách",
      "Một số mã Bosch như PUC64 sản xuất tại Tây Ban Nha - check cột xuất xứ trước khi cam kết",
      "Khách yêu cầu Đức thường không quan tâm Trung Quốc dù chính hãng",
    ],
    pitchExample:
      "Anh chị muốn hàng Đức thì em phải nói rõ luôn: trong Bosch có 2 dòng - sản xuất tại Đức và sản xuất ở các nước khác (Tây Ban Nha, Trung Quốc). Em chỉ tư vấn dòng Đức cho anh chị.",
  },
  {
    id: "KB-09",
    title: "Khách hay nướng / làm bánh",
    customer:
      "Khách quan tâm lò nướng tách rời và lò vi sóng âm tủ · Bếp là phụ trợ",
    filters: {
      houseTypes: ["any"],
      budgetMin: 20_000_000,
      budgetMax: 100_000_000,
      priorities: ["nuong-banh"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 25_500_000,
        items: [
          { sku: "SP O72P", fallbackName: "Spelier SP O72P - lò nướng", role: "Lò nướng", refPrice: 10_800_000 },
          { sku: "BFL524MB2", fallbackName: "Bosch BFL524MB2", role: "Lò vi sóng", refPrice: 12_780_000 },
          { sku: "EU-T685 Max", fallbackName: "Eurosun EU-T685 Max - đôi", role: "Bếp từ", refPrice: 4_920_000 },
          { sku: "SP 70AH", fallbackName: "Spelier SP 70AH Ver Pro", role: "Máy hút mùi", refPrice: 3_360_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 39_540_000,
        items: [
          { sku: "HBA514BS3", fallbackName: "Bosch HBA514BS3 - lò nướng", role: "Lò nướng", refPrice: 13_320_000 },
          { sku: "BEL554MB2", fallbackName: "Bosch BEL554MB2 (kèm nướng)", role: "Lò vi sóng", refPrice: 13_500_000 },
          { sku: "PUC631BB5E", fallbackName: "Bosch PUC631BB5E - đôi", role: "Bếp từ", refPrice: 9_480_000 },
          { sku: "DFT93AC50", fallbackName: "Bosch DFT93AC50", role: "Máy hút mùi", refPrice: 6_480_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 75_540_000,
        items: [
          { sku: "HBG634BS1", fallbackName: "Bosch HBG634BS1 - lò nướng cao cấp", role: "Lò nướng", refPrice: 22_000_000 },
          { sku: "BEL7321B1", fallbackName: "Bosch BEL7321B1 (kèm nướng - Anh)", role: "Lò vi sóng", refPrice: 28_080_000 },
          { sku: "PID675DC1E", fallbackName: "Bosch PID675DC1E - đôi", role: "Bếp từ", refPrice: 14_400_000 },
          { sku: "DFT93CA61B", fallbackName: "Bosch DFT93CA61B", role: "Máy hút mùi", refPrice: 6_600_000 },
        ],
      },
    ],
    reasoning: [
      "Lò vi sóng kèm nướng (Bosch BEL524, BEL554, BEL7321) - tiết kiệm tủ bếp so với có 2 lò riêng",
      "Phương án C có lò vi sóng BEL7321 sản xuất tại Anh - một trong những model tốt nhất Bosch tại Việt Nam",
      "Bếp từ chỉ cần đôi - khách dạng này nấu nồi không quá nhiều",
      "Lò nướng cao 60cm cần đề xuất theo kích thước tủ",
    ],
    pitchExample:
      "Anh chị làm bánh thì lò vi sóng kèm nướng là quan trọng nhất - không phải bếp. Em đề xuất Bosch BEL554 hoặc BEL7321 - đây là 2 mã được khách của em hay làm bánh đánh giá cao nhất.",
  },
  {
    id: "KB-10",
    title: "Cải tạo bếp cũ - thay 1-2 thiết bị",
    customer:
      "Khách không làm mới toàn bộ · Chỉ thay bếp, hoặc thay hút mùi, hoặc thay máy rửa chén",
    filters: {
      houseTypes: ["any"],
      budgetMin: 0,
      budgetMax: 50_000_000,
      priorities: ["gia-tot", "can-bang"],
    },
    tiers: [
      {
        tier: "A",
        label: "Tiết kiệm",
        total: 18_876_000,
        items: [
          { sku: "EU-T685 Max", fallbackName: "Eurosun EU-T685 Max - bếp", role: "Bếp từ", refPrice: 4_920_000 },
          { sku: "K-8070V", fallbackName: "Kocher K-8070V 70cm", role: "Máy hút mùi", refPrice: 2_940_000 },
          { sku: "SMS60E08EB", fallbackName: "Eurosun SMS60E08EB - 8 bộ", role: "Máy rửa chén", refPrice: 11_016_000 },
        ],
      },
      {
        tier: "B",
        label: "Cân bằng (khuyên dùng)",
        total: 21_660_000,
        items: [
          { sku: "DI-633", fallbackName: "Kocher DI-633", role: "Bếp từ", refPrice: 5_040_000 },
          { sku: "SP 109SO", fallbackName: "Spelier SP 109SO", role: "Máy hút mùi", refPrice: 5_232_000 },
          { sku: "DWJ-100", fallbackName: "Junger DWJ-100", role: "Máy rửa chén", refPrice: 11_388_000 },
        ],
      },
      {
        tier: "C",
        label: "Cao cấp",
        total: 30_420_000,
        items: [
          { sku: "PUC631BB5E", fallbackName: "Bosch PUC631BB5E", role: "Bếp từ", refPrice: 9_480_000 },
          { sku: "DFT63CA61B", fallbackName: "Bosch DFT63CA61B", role: "Máy hút mùi", refPrice: 5_220_000 },
          { sku: "SMS4HTI16E", fallbackName: "Bosch SMS4HTI16E", role: "Máy rửa chén", refPrice: 15_720_000 },
        ],
      },
    ],
    reasoning: [
      "Đo trước kích thước cũ (chiều rộng, sâu, cao) - không có gì khó chịu hơn việc lắp không vừa",
      "Bếp từ cần dây 6mm² và CB 32A riêng - nhà cũ chỉ có dây 4mm² thì cần báo trước",
      "Máy rửa chén cần ống cấp/thoát nước + ổ điện 220V/10A - khảo sát tại nhà bắt buộc",
      "Khách cải tạo thường ngân sách giới hạn - đề xuất phương án A trước, nâng cấp dần",
    ],
    pitchExample:
      "Cải tạo bếp cũ thì em không khuyên anh chị thay tất - chỉ thay cái nào hỏng. Đo trước kích thước cũ và xem dây điện. Em đề xuất Combo B - vừa tầm tiền, vừa nâng được chất lượng rõ rệt.",
  },
  {
    id: "KB-11",
    title: "Mua lẻ - chỉ cần bếp từ",
    customer:
      "Khách không mua bộ - chỉ thay bếp · Ngân sách thường < 15tr",
    filters: {
      houseTypes: ["any"],
      budgetMin: 0,
      budgetMax: 15_000_000,
      priorities: ["gia-tot"],
    },
    tiers: [
      {
        tier: "A",
        label: "Dưới 5 triệu",
        total: 720_000,
        items: [
          { sku: "SP 09", fallbackName: "Spelier SP 09 - bếp đơn 1 vùng", role: "Bếp từ đơn", refPrice: 720_000 },
        ],
      },
      {
        tier: "B",
        label: "5 - 8 triệu (khuyên dùng)",
        total: 5_040_000,
        items: [
          { sku: "DI-633", fallbackName: "Kocher DI-633 - bếp đôi", role: "Bếp từ đôi", refPrice: 5_040_000 },
        ],
      },
      {
        tier: "C",
        label: "8 - 15 triệu",
        total: 7_560_000,
        items: [
          { sku: "PUC61KAA5E", fallbackName: "Bosch PUC61KAA5E - bếp đôi nhập khẩu", role: "Bếp từ đôi", refPrice: 7_560_000 },
        ],
      },
    ],
    reasoning: [
      "Khách mua lẻ thường không quan tâm thương hiệu - quan trọng nhất là tính năng và giá",
      "Hỏi kỹ: 1 vùng nấu hay 2 vùng? Có làm món chiên nhiều không?",
      "Spelier SP 09 chỉ 720k là sản phẩm đặc biệt - tốt nhất showroom cho ngân sách dưới 1tr",
      "Khách mua lẻ có thể quay lại mua hút mùi sau - cho name card và lưu liên hệ",
    ],
    pitchExample:
      "Anh chị chỉ muốn thay bếp thôi thì em đề xuất Kocher DI-633 - bếp đôi 5 triệu, bảo hành 2 năm, đủ cho gia đình 3-4 người. Sau này có muốn nâng cấp hút mùi/rửa chén em vẫn ở đây.",
  },
  {
    id: "KB-12",
    title: "Mua lẻ - chỉ cần máy hút mùi",
    customer:
      "Khách không mua bộ - chỉ thay/lắp hút mùi · Ngân sách thường < 12tr",
    filters: {
      houseTypes: ["any"],
      budgetMin: 0,
      budgetMax: 12_000_000,
      priorities: ["gia-tot"],
    },
    tiers: [
      {
        tier: "A",
        label: "Dưới 3 triệu",
        total: 2_100_000,
        items: [
          { sku: "K-6070V", fallbackName: "Kocher K-6070V 70cm - cơ bản", role: "Máy hút mùi", refPrice: 2_100_000 },
        ],
      },
      {
        tier: "B",
        label: "3 - 6 triệu (khuyên dùng)",
        total: 5_232_000,
        items: [
          { sku: "SP 109SO", fallbackName: "Spelier SP 109SO - lọc than hoạt tính", role: "Máy hút mùi", refPrice: 5_232_000 },
        ],
      },
      {
        tier: "C",
        label: "6 - 12 triệu",
        total: 11_160_000,
        items: [
          { sku: "DFS067A51B", fallbackName: "Bosch DFS067A51B (Đức)", role: "Máy hút mùi", refPrice: 11_160_000 },
        ],
      },
    ],
    reasoning: [
      "Phải đo chiều rộng tủ bếp trước (60cm, 70cm, 90cm) - đo sai thì không lắp được",
      "Hỏi kiểu lắp: áp tường (chữ T), âm tủ, hay đảo (treo trần)?",
      "Khách Việt nấu nhiều dầu mỡ → ưu tiên hút mùi 90cm + công suất ≥ 800m³/h",
      "Hút mùi đảo (treo trần) đắt gấp 2-3 lần áp tường - phải xác nhận trước",
    ],
    pitchExample:
      "Anh chị nấu nhiều dầu mỡ thì 70cm hơi nhỏ - em đề xuất Spelier SP 109SO 5.2 triệu, có lọc than hoạt tính khử mùi tốt hơn nhiều so với hút mùi 2-3 triệu.",
  },
];

export const SCENARIO_BY_ID = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));
