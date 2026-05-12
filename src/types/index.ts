export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: Spec[];
  features: string[];
  inStock: boolean;
  tags: string[];
  productType: string;
  createdAt?: string;
};

export type Category = {
  slug: string;
  name: string;
  productCount: number;
};

export type Brand = {
  slug: string;
  name: string;
  productCount: number;
};

/** Tier good/better/best của mỗi kịch bản */
export type ComboTier = "A" | "B" | "C";

export type ComboItem = {
  /** SKU exact match từ Haravan, hoặc null nếu là gợi ý mở (vd "Bosch 15-18tr theo tủ") */
  sku: string | null;
  /** Tên hiển thị khi không match được SKU (fallback) */
  fallbackName: string;
  /** Vai trò trong combo (bếp từ, hút mùi, rửa chén...) */
  role: string;
  /** Giá tham chiếu từ playbook (VND) - dùng khi chưa match được SKU thật */
  refPrice: number;
};

export type ComboTierData = {
  tier: ComboTier;
  label: string;
  total: number;
  items: ComboItem[];
};

export type Scenario = {
  id: string;
  title: string;
  customer: string;
  filters: {
    houseTypes: ("chung-cu" | "nha-pho" | "biet-thu" | "any")[];
    budgetMin: number;
    budgetMax: number;
    priorities: ("gia-tot" | "can-bang" | "ben-cao-cap" | "thuong-hieu-duc" | "nuong-banh" | "cai-tao" | "mua-le" | "any")[];
  };
  tiers: ComboTierData[];
  reasoning: string[];
  pitchExample: string;
};

export type WizardAnswers = {
  houseType?: "chung-cu" | "nha-pho" | "biet-thu";
  status?: "nha-moi" | "cai-tao" | "tham-khao";
  family?: "1-2" | "3-4" | "5+";
  cookingStyle?: "viet-nhieu-dau-mo" | "nau-nhe" | "nuong-banh";
  budget?: "duoi-15" | "15-30" | "30-60" | "60-100" | "100-150" | "tren-150";
  priority?: "gia-tot" | "can-bang" | "ben-cao-cap" | "thuong-hieu-duc" | "nuong-banh";
  /** Phong thủy (optional) */
  birthYear?: number;
  gender?: "nam" | "nu";
};

export type FilterState = {
  search?: string;
  categories: string[];
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly: boolean;
  sort: "newest" | "price-asc" | "price-desc" | "name-asc";
  page: number;
  perPage: number;
};
