"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, RefreshCw, Package } from "lucide-react";
import type { ComboTierData, Scenario } from "@/types";
import {
  generateProductGroups,
  type GroupItem,
  type ProductGroup,
} from "@/lib/product-groups";
import { formatPrice, cn } from "@/lib/utils";
import { bnbProductUrl } from "@/lib/seo";

type Props = {
  scenario: Scenario;
  tier: ComboTierData;
};

export default function ProductGroupPanel({ scenario, tier }: Props) {
  const groups = useMemo<ProductGroup[]>(
    () => generateProductGroups(scenario, tier),
    [scenario, tier]
  );
  const [index, setIndex] = useState(0);

  // Reset về nhóm chuẩn khi đổi scenario hoặc tier
  useEffect(() => {
    setIndex(0);
  }, [scenario.id, tier.tier]);

  const safeIndex = Math.min(index, groups.length - 1);
  const current = groups[safeIndex];
  const canRotate = groups.length > 1;
  const playbookTotal = groups[0]?.total ?? tier.total;
  const diff = current.total - playbookTotal;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-600">
            <Package className="h-3 w-3" />
            Phương án {tier.tier} · {tier.label}
          </div>
          <h3 className="mt-2 text-lg font-bold text-stone-900">
            {current.items.length} thiết bị · Tổng{" "}
            <span className="text-amber-800">{formatPrice(current.total)}</span>
          </h3>
          <p className="mt-0.5 text-xs text-stone-500">
            {current.source === "playbook"
              ? "Đúng theo cấu trúc Sales Playbook BNB"
              : `Cùng phân khúc giá · chênh ${diff >= 0 ? "+" : ""}${formatPrice(
                  Math.abs(diff)
                ).replace(" ₫", "")} ₫ so với nhóm chuẩn`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={() => setIndex((i) => (i + 1) % groups.length)}
            disabled={!canRotate}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
              canRotate
                ? "bg-amber-700 text-white hover:bg-amber-800"
                : "cursor-not-allowed bg-stone-100 text-stone-400"
            )}
            title={
              canRotate
                ? "Xáo nhóm sản phẩm khác trong cùng phân khúc"
                : "Không có nhóm thay thế phù hợp"
            }
          >
            <RefreshCw className="h-4 w-4" />
            Đổi nhóm sản phẩm
          </button>
          <span className="text-[11px] font-medium text-stone-500">
            {safeIndex + 1} / {groups.length} · {current.label}
          </span>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {current.items.map((item, i) => (
          <ProductCard key={`${current.label}-${i}`} item={item} />
        ))}
      </div>

      {current.source === "alt" && (
        <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-[11px] leading-relaxed text-stone-600">
          Nhóm thay thế giúp anh/chị tham khảo các lựa chọn khác trong{" "}
          <strong>cùng phân khúc giá</strong> — vai trò thiết bị giữ nguyên theo
          Playbook. Bấm <strong>Đổi nhóm sản phẩm</strong> để xem các tổ hợp
          khác, hoặc bấm lại để quay về nhóm chuẩn.
        </p>
      )}
    </section>
  );
}

function ProductCard({ item }: { item: GroupItem }) {
  const product = item.product;
  const name = product?.name ?? item.fallbackName;
  const price = product?.price ?? item.refPrice;
  const image = product?.thumbnail;

  return (
    <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3 transition hover:border-stone-300">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-1"
            sizes="80px"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center text-[10px] text-stone-400">
            (chưa có ảnh)
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
          {item.role}
        </div>
        {product ? (
          <a
            href={bnbProductUrl(product.slug)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-start gap-1 text-sm font-semibold text-stone-900 hover:text-amber-800"
          >
            <span className="line-clamp-2">{name}</span>
            <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 opacity-60" />
          </a>
        ) : (
          <div className="line-clamp-2 text-sm font-semibold text-stone-900">
            {name}
          </div>
        )}
        <div className="mt-1 text-sm font-bold text-stone-700">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}
