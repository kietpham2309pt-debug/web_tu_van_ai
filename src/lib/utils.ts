import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(vnd: number): string {
  if (!vnd || vnd <= 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

export function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stripHtml(html: string, maxLen?: number): string {
  const txt = (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return maxLen ? txt.slice(0, maxLen) : txt;
}

const HOUSE_LABEL: Record<string, string> = {
  "chung-cu": "Chung cư",
  "nha-pho": "Nhà phố",
  "biet-thu": "Biệt thự / Penthouse",
};

const BUDGET_LABEL: Record<string, string> = {
  "duoi-15": "Dưới 15 triệu (mua lẻ)",
  "15-30": "15 - 30 triệu",
  "30-60": "30 - 60 triệu",
  "60-100": "60 - 100 triệu",
  "100-150": "100 - 150 triệu",
  "tren-150": "Trên 150 triệu",
};

const PRIORITY_LABEL: Record<string, string> = {
  "gia-tot": "Giá tốt, vừa đủ dùng",
  "can-bang": "Cân bằng giá và chất lượng",
  "ben-cao-cap": "Bền, cao cấp lâu dài",
  "thuong-hieu-duc": "Thương hiệu Đức (Bosch / Spelier)",
  "nuong-banh": "Hay nướng / làm bánh",
};

export const labels = {
  house: (k?: string) => (k ? HOUSE_LABEL[k] ?? k : ""),
  budget: (k?: string) => (k ? BUDGET_LABEL[k] ?? k : ""),
  priority: (k?: string) => (k ? PRIORITY_LABEL[k] ?? k : ""),
};

export function budgetRange(b?: string): [number, number] {
  switch (b) {
    case "duoi-15": return [0, 15_000_000];
    case "15-30": return [15_000_000, 30_000_000];
    case "30-60": return [30_000_000, 60_000_000];
    case "60-100": return [60_000_000, 100_000_000];
    case "100-150": return [100_000_000, 150_000_000];
    case "tren-150": return [150_000_000, 1_000_000_000];
    default: return [0, 1_000_000_000];
  }
}
