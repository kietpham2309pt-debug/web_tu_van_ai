import { ExternalLink } from "lucide-react";
import { PLAYBOOK_BRANDS, BRAND_SLUG } from "@/lib/products-data";
import { bnbCollectionUrl } from "@/lib/seo";
import summary from "@/data/summary.json";

export default function Brands() {
  const counts = (summary as { brandCounts: Record<string, number> }).brandCounts;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-amber-800">
          13 HÃNG THIẾT BỊ BẾP
        </div>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Showroom đa thương hiệu cao cấp
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Click vào hãng để xem sản phẩm trên bepngocbao.vn
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {PLAYBOOK_BRANDS.map((b) => {
          const slug = BRAND_SLUG[b];
          const href = slug ? bnbCollectionUrl(slug) : bnbCollectionUrl("all");
          return (
            <a
              key={b}
              href={href}
              target="_blank"
              rel="noopener"
              className="group relative flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
            >
              <ExternalLink className="absolute right-2 top-2 h-3 w-3 text-stone-300 transition group-hover:text-amber-700" />
              <div className="font-bold text-stone-800 group-hover:text-amber-800">{b}</div>
              <div className="mt-1 text-[11px] text-stone-500">
                {counts[b] ?? 0} sản phẩm
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
