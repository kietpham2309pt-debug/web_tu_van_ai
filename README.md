# BNB AI Kitchen — Bếp Ngọc Bảo

Web app tra cứu sản phẩm + tư vấn bếp AI + demo căn bếp bằng AI image (gpt-image-1).

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · OpenAI SDK · Haravan API

---

## Tính năng

1. **Tư vấn AI 5 câu vàng** (`/tu-van-ai`) — wizard hỏi loại nhà, tình trạng, gia đình, ngân sách, ưu tiên. AI map vào 1 trong 12 kịch bản combo từ **Sales Playbook BNB** (KB-01 → KB-12), đề xuất 3 phương án Tiết kiệm / Cân bằng / Cao cấp với SKU và giá thật.
2. **Tra cứu sản phẩm** (`/san-pham`) — 1.700+ sản phẩm Haravan, filter theo brand / category / khoảng giá, sort, search, trang chi tiết với gallery + thông số kỹ thuật.
3. **Demo bếp AI** (`/demo-bep`) — chọn kịch bản + tier + layout (chữ I/L/U/đảo) + phong cách → OpenAI gpt-image-1 sinh ảnh căn bếp realistic chứa đúng combo thiết bị đã chọn (~15-40s).
4. **Liên hệ** (`/lien-he`) — form đặt lịch khảo sát tại nhà (mailto fallback) + Zalo/Hotline deep link.

---

## Setup

### 1. Cài dependencies

```bash
cd D:\DATA_WEB\web_3
npm install
```

### 2. Cấu hình env

```bash
cp .env.local.example .env.local
```

Sửa `.env.local`:

```
HARAVAN_TOKEN=<token Haravan của BNB>
GOOGLE_API_KEY=AIzaSy...        # khuyến nghị (free tier)
# OPENAI_API_KEY=sk-proj-...    # tuỳ chọn fallback
NEXT_PUBLIC_BASE_URL=https://bepngocbao.vn
```

**Lấy Google API Key (miễn phí, 5 phút):**

1. Vào https://aistudio.google.com/app/apikey
2. Login bằng Google account → bấm **"Create API key"**
3. Copy key dạng `AIzaSy...` vào `.env.local`
4. Không cần verify ID, không cần thẻ credit cho free tier
5. Default model: `gemini-2.5-flash-image-preview` (multimodal, miễn phí)
6. Để nâng cấp Imagen 4 chất lượng cao hơn (trả phí): set `GEMINI_IMAGE_MODEL=imagen-4.0-generate-001`

### 3. Fetch sản phẩm từ Haravan

```bash
npm run fetch:haravan
```

Sinh ra:

- `src/data/products.json` — toàn bộ ~1.751 sản phẩm
- `src/data/summary.json` — đếm theo brand/category
- `src/data/category-counts.json`

Chạy lại lệnh này định kỳ (cron / GitHub Action) để đồng bộ với Haravan.

### 4. Dev server

```bash
npm run dev
```

Mở http://localhost:3000.

### 5. Build production

```bash
npm run build && npm start
```

---

## Cấu trúc

```
src/
├── app/
│   ├── page.tsx                        # Home: Hero + How it works + Combos + Brands
│   ├── tu-van-ai/page.tsx              # Wizard 5 bước
│   ├── san-pham/page.tsx               # Catalog
│   ├── san-pham/[slug]/page.tsx        # Product detail
│   ├── demo-bep/page.tsx               # AI kitchen demo
│   ├── lien-he/page.tsx                # Contact
│   ├── api/generate-kitchen/route.ts   # OpenAI gpt-image-1 endpoint
│   └── layout.tsx + globals.css
├── components/
│   ├── layout/      # Header, Footer
│   ├── home/        # Hero, HowItWorks, PopularCombos, Brands
│   ├── wizard/      # Wizard, WizardResult
│   ├── products/    # ProductCard, ProductsClient
│   └── kitchen/     # KitchenDemo, KitchenDemoLauncher
├── data/
│   ├── scenarios.ts            # 12 kịch bản KB-01..KB-12 (playbook)
│   ├── products.json           # ★ sinh từ Haravan
│   └── summary.json            # ★
├── lib/
│   ├── products-data.ts        # filter, getBySlug, getBySku
│   ├── match-scenario.ts       # rule-based: wizard answers → scenario
│   ├── kitchen-prompt.ts       # build prompt cho gpt-image-1
│   ├── utils.ts                # formatPrice, slugify, cn
│   └── seo.ts                  # SITE_NAME, BASE_URL, info showroom
├── types/index.ts
└── scripts/
    └── fetch-haravan.mjs       # crawl Haravan → JSON
```

---

## Cách 12 kịch bản hoạt động

Mỗi scenario trong `src/data/scenarios.ts` có shape:

```ts
{
  id: "KB-01",
  title: "Chung cư · Ngân sách dưới 30 triệu",
  filters: {
    houseTypes: ["chung-cu"],
    budgetMin: 0, budgetMax: 30_000_000,
    priorities: ["gia-tot", "can-bang"],
  },
  tiers: [
    { tier: "A", label: "Tiết kiệm", total: 14_889_000, items: [...] },
    { tier: "B", label: "Cân bằng",  total: 22_429_000, items: [...] },
    { tier: "C", label: "Cao cấp",   total: 28_645_000, items: [...] },
  ],
  reasoning: ["..."],
  pitchExample: "...",
}
```

`items` chứa SKU exact (vd `"PUC631BB5E"`). `getProductBySku()` sẽ map SKU → product Haravan thật để hiển thị ảnh, giá realtime, link tới trang chi tiết.

Nếu SKU không match (vd Bosch lò nướng "Bosch 15-18tr theo tủ"), hệ thống fallback dùng `fallbackName` và `refPrice` từ playbook.

`matchScenarios(answers)` chấm điểm 12 scenario theo trùng houseType + overlap budget + priority + bonus cho cooking style "nuong-banh" và status "cai-tao".

---

## Cách AI image hoạt động

`POST /api/generate-kitchen`:

```json
{
  "scenarioId": "KB-03",
  "tier": "B",
  "layout": "l-shape",
  "style": "modern",
  "provider": "gemini"
}
```

Server:

1. Load scenario + tier
2. Build prompt từ `buildKitchenPrompt()` — mô tả layout, style, từng thiết bị theo role (bếp từ, hút mùi, rửa chén...) sang tiếng Anh chính xác
3. Gọi provider được chọn:
   - **Gemini** (mặc định nếu có `GOOGLE_API_KEY`) — `gemini-2.5-flash-image-preview` qua `@google/genai`
   - **OpenAI** — `gpt-image-1` (cần verify Organization)
4. Trả về base64 data URL

Provider được lựa chọn theo thứ tự:
- Body request có `provider` → dùng cái đó
- Ngược lại: có `GOOGLE_API_KEY` → Gemini, không thì OpenAI

Chi phí so sánh:

| Provider | Model | Chi phí | Note |
|---|---|---|---|
| Gemini | `gemini-2.5-flash-image-preview` | **Free** trong rate limit | Default |
| Gemini | `imagen-4.0-generate-001` | ~$0.04/ảnh | Chất lượng cao hơn |
| Gemini | `imagen-4.0-fast-generate-001` | ~$0.02/ảnh | Nhanh, rẻ hơn Imagen 4 |
| OpenAI | `gpt-image-1` (medium) | ~$0.04/ảnh | Cần verify org |
| OpenAI | `gpt-image-1` (high) | ~$0.17/ảnh | Đẹp nhất |

---

## Deploy

Vercel hoạt động out-of-the-box:

1. Push code lên GitHub
2. Import vào Vercel
3. Set env: `HARAVAN_TOKEN`, `OPENAI_API_KEY`, `NEXT_PUBLIC_BASE_URL`
4. Run `npm run fetch:haravan` local trước khi push (vì `products.json` đang trong `.gitignore`) — hoặc setup GitHub Action chạy cron

> Lưu ý: `maxDuration = 60` ở `/api/generate-kitchen` cần plan Vercel Pro (Hobby giới hạn 10s). Hoặc deploy lên Railway / Render / VPS.

---

## Customize

- **Thêm kịch bản mới**: edit `src/data/scenarios.ts`, thêm object Scenario, cập nhật `filters` và 3 tiers.
- **Đổi prompt AI**: edit `src/lib/kitchen-prompt.ts` — function `describeItem()` map role → mô tả tiếng Anh, `buildKitchenPrompt()` ghép lại.
- **Thêm layout / style**: thêm vào `LAYOUTS` / `STYLES` array trong cùng file, kèm `LAYOUT_DESC` / `STYLE_DESC`.

---

## Nguồn dữ liệu

- **Playbook BNB Sales** (`D:/DATA_WEB/web_3/BNB_Sales_Playbook.docx`) — 12 kịch bản combo, 5 câu hỏi vàng, 7 bước tư vấn
- **20 Scenarios Training** (`D:/DATA_WEB/web_3/BNB_20_Scenarios_Training.docx`) — chân dung khách, tín hiệu nhận biết, nguyên tắc bán hàng
- **Haravan API** — `apis.haravan.com/com` với Bearer token
