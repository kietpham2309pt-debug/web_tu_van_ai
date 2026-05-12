#!/usr/bin/env node
/**
 * Fetch toàn bộ sản phẩm Haravan của Bếp Ngọc Bảo → src/data/products.json + summary.json + category-counts.json
 *
 * Cách dùng:
 *   HARAVAN_TOKEN=xxx node scripts/fetch-haravan.mjs
 * Hoặc đọc từ .env.local (sẽ tự load nếu tồn tại)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

// ── load .env.local nhẹ tay (không dùng dotenv để khỏi thêm deps) ──
try {
  const envPath = path.join(ROOT, ".env.local");
  if (fs.existsSync(envPath)) {
    const txt = fs.readFileSync(envPath, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {}

const TOKEN = process.env.HARAVAN_TOKEN;
if (!TOKEN) {
  console.error("❌ Thiếu HARAVAN_TOKEN. Set env hoặc tạo .env.local.");
  process.exit(1);
}

const BASE = "https://apis.haravan.com/com";
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/json",
  "User-Agent": "BNB-AI-Kitchen/1.0",
};

async function get(pathname, params = {}) {
  const url = new URL(BASE + pathname);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  for (let attempt = 1; attempt <= 5; attempt++) {
    const r = await fetch(url, { headers: HEADERS });
    if ([429, 500, 502, 503, 504].includes(r.status)) {
      await new Promise((res) => setTimeout(res, 2 ** attempt * 500));
      continue;
    }
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} @ ${pathname}`);
    return r.json();
  }
  throw new Error("retry exhausted");
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractSpecsFromHtml(html) {
  if (!html) return [];
  const specs = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = trRegex.exec(html))) {
    const tds = [];
    let n;
    tdRegex.lastIndex = 0;
    while ((n = tdRegex.exec(m[1]))) {
      tds.push(n[1].replace(/<[^>]+>/g, "").trim());
    }
    if (tds.length >= 2 && tds[0] && tds[1]) {
      specs.push({ label: tds[0], value: tds[1] });
    }
  }
  return specs;
}

function extractFeaturesFromHtml(html) {
  if (!html) return [];
  const ul = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!ul) return [];
  const lis = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  return lis.map((l) => l[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean);
}

function shortDescFromBodyPlain(p) {
  if (!p) return "";
  return p.replace(/\s+/g, " ").trim().slice(0, 200);
}

function inferCategorySlug(product) {
  const type = product.product_type || "";
  const tags = (product.tags || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const blob = `${type} ${tags} ${title}`.toLowerCase();

  if (/bếp từ|bep tu|bếp điện từ/.test(blob)) return "bep-tu";
  if (/hút mùi|hut mui|máy hút khử|may hut khu/.test(blob)) return "may-hut-mui";
  if (/rửa chén|rua chen|rửa bát|rua bat/.test(blob)) return "may-rua-chen";
  if (/lò nướng|lo nuong/.test(blob)) return "lo-nuong";
  if (/lò vi sóng|lo vi song|microwave/.test(blob)) return "lo-vi-song";
  if (/lò hấp|lo hap/.test(blob)) return "lo-hap";
  if (/chậu rửa|chau rua/.test(blob)) return "chau-rua";
  if (/vòi rửa|voi rua/.test(blob)) return "voi-rua";
  if (/tủ lạnh|tu lanh|refrigerator/.test(blob)) return "tu-lanh";
  if (/tủ rượu|tu ruou|tủ đông|tu dong/.test(blob)) return "tu-ruou";
  if (/máy xay|may xay/.test(blob)) return "may-xay";
  if (/máy pha|may pha|cà phê/.test(blob)) return "may-pha-ca-phe";
  if (/phụ kiện|phu kien/.test(blob)) return "phu-kien";
  if (type) return slugify(type);
  return "khac";
}

function inferCategoryName(slug) {
  const map = {
    "bep-tu": "Bếp từ",
    "may-hut-mui": "Máy hút mùi",
    "may-rua-chen": "Máy rửa chén",
    "lo-nuong": "Lò nướng",
    "lo-vi-song": "Lò vi sóng",
    "lo-hap": "Lò hấp",
    "chau-rua": "Chậu rửa",
    "voi-rua": "Vòi rửa",
    "tu-lanh": "Tủ lạnh",
    "tu-ruou": "Tủ rượu",
    "may-xay": "Máy xay",
    "may-pha-ca-phe": "Máy pha cà phê",
    "phu-kien": "Phụ kiện",
    khac: "Khác",
  };
  return map[slug] || slug;
}

async function main() {
  const shop = (await get("/shop.json")).shop;
  console.log(`✓ Shop: ${shop.name}`);

  const { count } = await get("/products/count.json");
  console.log(`✓ Tổng sản phẩm trên Haravan: ${count}`);

  const products = [];
  const seenSlugs = new Set();
  let page = 1;
  const pageSize = 50;

  while (true) {
    const data = await get("/products.json", { limit: pageSize, page });
    const list = data.products || [];
    if (!list.length) break;
    console.log(`  page ${page}: +${list.length}`);

    for (const p of list) {
      const variant = (p.variants || []).find((v) => (v.sku || "").trim()) || p.variants?.[0] || {};
      const sku = (variant.sku || "").trim() || String(p.id);
      const price = Math.round(Number(variant.price || 0));
      const compareAt = Math.round(Number(variant.compare_at_price || 0));
      let slug = p.handle || slugify(p.title);
      if (seenSlugs.has(slug)) slug = `${slug}-${p.id}`;
      seenSlugs.add(slug);

      const images = (p.images || []).map((i) => i.src).filter(Boolean);
      const category = inferCategorySlug(p);
      const specs = extractSpecsFromHtml(p.body_html || "");
      const features = extractFeaturesFromHtml(p.body_html || "");
      const inStock = (p.variants || []).some(
        (v) => (v.inventory_advance?.qty_available ?? 0) > 0 || v.inventory_policy === "continue"
      );

      products.push({
        id: String(p.id),
        sku,
        slug,
        name: p.title,
        brand: p.vendor || "",
        category,
        categoryName: inferCategoryName(category),
        price,
        originalPrice: compareAt > price ? compareAt : undefined,
        discount: compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : undefined,
        images,
        thumbnail: images[0] || "",
        description: p.body_html || "",
        shortDescription: shortDescFromBodyPlain(p.body_plain),
        specs,
        features,
        inStock,
        tags: (p.tags || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        productType: p.product_type || "",
        createdAt: p.created_at,
      });
    }

    page += 1;
    await new Promise((r) => setTimeout(r, 250));
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "products.json"), JSON.stringify(products, null, 2), "utf8");

  const brandCounts = {};
  const categoryCounts = {};
  for (const p of products) {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  const summary = {
    shop: { name: shop.name, domain: shop.domain, currency: shop.currency },
    totalProducts: products.length,
    brandCounts,
    categoryCounts,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(DATA_DIR, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(
    path.join(DATA_DIR, "category-counts.json"),
    JSON.stringify(categoryCounts, null, 2),
    "utf8"
  );

  console.log(`\n✓ Đã lưu ${products.length} sản phẩm → src/data/products.json`);
  console.log(`✓ Brand: ${Object.keys(brandCounts).length}, Category: ${Object.keys(categoryCounts).length}`);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
