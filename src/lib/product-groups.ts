import type { ComboTierData, Product, Scenario } from "@/types";
import {
  PLAYBOOK_BRANDS,
  getAllProducts,
  getProductBySku,
} from "@/lib/products-data";

export type GroupItem = {
  role: string;
  product?: Product;
  fallbackName: string;
  refPrice: number;
  sku: string | null;
};

export type ProductGroup = {
  /** "playbook" = nhóm chuẩn từ Sales Playbook; "alt" = nhóm thay thế cùng phân khúc */
  source: "playbook" | "alt";
  label: string;
  items: GroupItem[];
  total: number;
};

const ROLE_TO_CATEGORY: Record<string, string> = {
  "bep tu": "bep-tu",
  "bep tu don": "bep-tu",
  "bep tu doi": "bep-tu",
  "may hut mui": "may-hut-mui",
  "may rua chen": "may-rua-chen",
  "chau rua": "chau-rua",
  "voi rua": "voi-rua",
  "lo nuong": "lo-nuong",
  "lo vi song": "lo-vi-song",
  "lo hap": "lo-hap",
  "tu lanh": "tu-lanh",
  "tu ruou": "tu-ruou",
};

function normRole(role: string): string {
  return role
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function roleToCategory(role: string): string | undefined {
  return ROLE_TO_CATEGORY[normRole(role)];
}

/**
 * Sinh các "nhóm sản phẩm" trong cùng phân khúc giá của 1 tier.
 *
 * Nhóm 0 = nhóm chuẩn Playbook (đúng SKU trong file Word).
 * Nhóm 1..N = nhóm thay thế: cùng category cho từng role, giá ±band quanh refPrice,
 *   chỉ lấy 13 hãng playbook.
 */
export function generateProductGroups(
  scenario: Scenario,
  tier: ComboTierData,
  options: { maxGroups?: number; priceBand?: number } = {}
): ProductGroup[] {
  const maxGroups = options.maxGroups ?? 5;
  const band = options.priceBand ?? 0.35;
  const all = getAllProducts();

  // --- Group 0: Playbook chuẩn ---
  const playbookItems: GroupItem[] = tier.items.map((it) => ({
    role: it.role,
    sku: it.sku,
    fallbackName: it.fallbackName,
    refPrice: it.refPrice,
    product: it.sku ? getProductBySku(it.sku) : undefined,
  }));
  const playbookTotal = playbookItems.reduce(
    (s, x) => s + (x.product?.price ?? x.refPrice),
    0
  );

  const groups: ProductGroup[] = [
    {
      source: "playbook",
      label: `Nhóm chuẩn · ${scenario.id}-${tier.tier}`,
      items: playbookItems,
      total: playbookTotal,
    },
  ];

  // --- Candidates per role ---
  const playbookSet = new Set(
    playbookItems
      .map((x) => x.product?.id)
      .filter((x): x is string => Boolean(x))
  );

  const pools = tier.items.map((it) => {
    const cat = roleToCategory(it.role);
    if (!cat) return { item: it, pool: [] as Product[] };
    const minPrice = it.refPrice * (1 - band);
    const maxPrice = it.refPrice * (1 + band);

    const pool = all
      .filter(
        (p) =>
          p.category === cat &&
          PLAYBOOK_BRANDS.includes(p.brand) &&
          p.price >= minPrice &&
          p.price <= maxPrice &&
          p.inStock &&
          !playbookSet.has(p.id)
      )
      .sort(
        (a, b) =>
          Math.abs(a.price - it.refPrice) - Math.abs(b.price - it.refPrice)
      );

    return { item: it, pool };
  });

  // --- Group 1..N: rotate qua các candidate ---
  const seen = new Set<string>();
  seen.add(playbookItems.map((x) => x.product?.id ?? `r:${x.role}`).join("|"));

  let altIdx = 0;
  const maxRotations =
    Math.max(0, ...pools.map((p) => p.pool.length)) || 0;

  for (
    let i = 0;
    i < maxRotations && groups.length < maxGroups + 1;
    i++
  ) {
    const items: GroupItem[] = pools.map(({ item, pool }) => {
      const product = pool.length ? pool[i % pool.length] : undefined;
      return {
        role: item.role,
        sku: item.sku,
        fallbackName: item.fallbackName,
        refPrice: item.refPrice,
        product: product ?? (item.sku ? getProductBySku(item.sku) : undefined),
      };
    });

    const sig = items.map((x) => x.product?.id ?? `r:${x.role}`).join("|");
    if (seen.has(sig)) continue;
    seen.add(sig);

    const total = items.reduce(
      (s, x) => s + (x.product?.price ?? x.refPrice),
      0
    );

    altIdx += 1;
    groups.push({
      source: "alt",
      label: `Nhóm thay thế ${altIdx}`,
      items,
      total,
    });
  }

  return groups;
}
