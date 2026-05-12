import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import {
  SHOP_ADDRESS,
  SHOP_EMAIL,
  SHOP_PHONE,
  SITE_NAME,
  BNB_LOGO,
  bnbCollectionUrl,
} from "@/lib/seo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <a
              href="https://bepngocbao.vn"
              target="_blank"
              rel="noopener"
              className="mb-3 inline-block"
            >
              <Image src={BNB_LOGO} alt="Bếp Ngọc Bảo" width={400} height={61} className="h-10 w-auto" />
            </a>
            <p className="text-sm text-stone-600">
              Showroom đa thương hiệu cao cấp — Bosch, Spelier, Kocher, Konox… Tư vấn AI &amp; demo
              bếp bằng AI, bảo hành chính hãng, lắp đặt tận nơi.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-900">
              Trải nghiệm AI
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/tu-van-ai" className="hover:text-amber-700">Tư vấn 5 câu hỏi vàng</Link></li>
              <li><Link href="/tu-van-ai" className="hover:text-amber-700">Phong thuỷ ngũ hành</Link></li>
              <li><Link href="/demo-bep" className="hover:text-amber-700">Demo bếp AI</Link></li>
              <li><Link href="/lien-he" className="hover:text-amber-700">Đặt lịch khảo sát</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-900">
              Sản phẩm
              <span className="ml-1.5 inline-block text-[10px] font-normal text-stone-400">
                (mở bepngocbao.vn)
              </span>
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              {[
                { slug: "all", label: "Tất cả sản phẩm" },
                { slug: "bep-tu", label: "Bếp từ" },
                { slug: "may-hut-mui", label: "Máy hút mùi" },
                { slug: "may-rua-chen", label: "Máy rửa chén" },
                { slug: "lo-nuong", label: "Lò nướng" },
                { slug: "chau-rua", label: "Chậu & Vòi" },
              ].map((c) => (
                <li key={c.slug}>
                  <a
                    href={bnbCollectionUrl(c.slug)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 hover:text-amber-700"
                  >
                    {c.label}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-900">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
                <span>{SHOP_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-700" />
                <a href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`} className="hover:text-amber-700">
                  {SHOP_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-700" />
                <a href={`mailto:${SHOP_EMAIL}`} className="hover:text-amber-700">{SHOP_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {SITE_NAME} ·{" "}
          <a
            href="https://bepngocbao.vn"
            target="_blank"
            rel="noopener"
            className="hover:text-amber-700"
          >
            bepngocbao.vn
          </a>
        </div>
      </div>
    </footer>
  );
}
