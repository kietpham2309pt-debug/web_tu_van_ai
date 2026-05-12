import productsRaw from "@/data/products.json";
import type { Product, FilterState } from "@/types";

const products = productsRaw as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsBySku(skus: string[]): Product[] {
  const set = new Set(skus.map((s) => s.toLowerCase().trim()));
  return products.filter((p) => set.has((p.sku || "").toLowerCase().trim()));
}

export function getProductBySku(sku: string): Product | undefined {
  const s = sku.toLowerCase().trim();
  return products.find((p) => (p.sku || "").toLowerCase().trim() === s);
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of products) {
    const key = p.category;
    if (!map.has(key)) map.set(key, { slug: key, name: p.categoryName, count: 0 });
    map.get(key)!.count += 1;
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getBrands(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of products) {
    if (!p.brand) continue;
    const key = p.brand.toLowerCase();
    if (!map.has(key)) map.set(key, { slug: key, name: p.brand, count: 0 });
    map.get(key)!.count += 1;
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

/** 13 hãng thiết bị bếp trong playbook BNB — ưu tiên hiển thị */
export const PLAYBOOK_BRANDS = [
  "Bosch",
  "Spelier",
  "Kocher",
  "Chef's",
  "Konox",
  "Eurosun",
  "Junger",
  "GrandX",
  "Kaff",
  "Canzy",
  "Garis",
  "Toshiba",
  "Kluger",
];

/** Tên brand hiển thị → slug Haravan collection. Lưu ý Chef's = "chef-s". */
export const BRAND_SLUG: Record<string, string> = {
  Bosch: "bosch",
  Spelier: "spelier",
  Kocher: "kocher",
  "Chef's": "chef-s",
  Konox: "konox",
  Eurosun: "eurosun",
  Junger: "junger",
  GrandX: "grandx",
  Kaff: "kaff",
  Canzy: "canzy",
  Garis: "garis",
  Toshiba: "toshiba",
  Kluger: "kluger",
};

export function getKitchenProducts(): Product[] {
  const kitchenCategories = new Set([
    "bep-tu",
    "may-hut-mui",
    "may-rua-chen",
    "lo-nuong",
    "lo-vi-song",
    "lo-hap",
    "chau-rua",
    "voi-rua",
    "tu-lanh",
    "tu-ruou",
  ]);
  return products.filter(
    (p) => kitchenCategories.has(p.category) && PLAYBOOK_BRANDS.includes(p.brand)
  );
}

export function filterAndPaginate(state: Partial<FilterState> & { perPage?: number; page?: number }) {
  const perPage = state.perPage ?? 20;
  const page = state.page ?? 1;
  const search = state.search?.toLowerCase().trim() ?? "";
  const cats = new Set((state.categories ?? []).map((s) => s.toLowerCase()));
  const brands = new Set((state.brands ?? []).map((s) => s.toLowerCase()));
  const priceMin = state.priceMin ?? 0;
  const priceMax = state.priceMax ?? Number.MAX_SAFE_INTEGER;
  const inStockOnly = state.inStockOnly ?? false;
  const sort = state.sort ?? "newest";

  let list = products.filter((p) => {
    if (cats.size && !cats.has(p.category.toLowerCase())) return false;
    if (brands.size && !brands.has(p.brand.toLowerCase())) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (inStockOnly && !p.inStock) return false;
    if (search) {
      const blob = `${p.name} ${p.brand} ${p.sku} ${p.shortDescription}`.toLowerCase();
      if (!blob.includes(search)) return false;
    }
    return true;
  });

  switch (sort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name, "vi")); break;
    case "newest":
    default:
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const items = list.slice((page - 1) * perPage, page * perPage);
  return { items, total, pages, page };
}
