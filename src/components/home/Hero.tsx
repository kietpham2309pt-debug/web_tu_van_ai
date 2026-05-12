import Link from "next/link";
import { Sparkles, ArrowRight, ImagePlus, Search, ExternalLink } from "lucide-react";
import { bnbCollectionUrl } from "@/lib/seo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/50 to-stone-100">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(#92400e_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-xs font-semibold text-amber-800 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              CÔNG NGHỆ MỚI · TƯ VẤN BẰNG AI
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Mua bếp đúng <br />
              <span className="text-amber-800">ngay lần đầu.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              Trả lời 5 câu hỏi vàng — AI sẽ chọn đúng combo bếp theo ngôi nhà, ngân sách và phong
              cách nấu của bạn. Xem trước căn bếp bằng AI image trước khi quyết định.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tu-van-ai"
                className="group inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 font-semibold text-white shadow-lg shadow-stone-900/20 hover:bg-stone-700"
              >
                Bắt đầu tư vấn AI
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href={bnbCollectionUrl("all")}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 font-semibold text-stone-800 hover:border-stone-400"
              >
                <Search className="h-4 w-4" />
                Tra cứu 1.700+ sản phẩm
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-stone-200 pt-6">
              <Stat value="1.751" label="Sản phẩm chính hãng" />
              <Stat value="13" label="Thương hiệu cao cấp" />
              <Stat value="12" label="Combo bếp mẫu" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-300/40 to-stone-300/40 blur-3xl" />
            <div className="relative grid gap-4">
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800">
                  <Sparkles className="h-3.5 w-3.5" /> 5 câu hỏi vàng
                </div>
                <div className="space-y-2.5">
                  {[
                    "Anh chị ở chung cư, nhà phố hay biệt thự?",
                    "Đây là nhà mới hay đang cải tạo?",
                    "Gia đình mấy người, kiểu nấu thế nào?",
                    "Ngân sách dự kiến bao nhiêu?",
                    "Anh chị quan tâm nhất điều gì?",
                  ].map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-stone-50 px-3 py-2.5 text-sm"
                    >
                      <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-amber-700 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-stone-700">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <ImagePlus className="h-4 w-4" />
                  AI vẽ căn bếp của bạn
                </div>
                <p className="mt-1 text-xs text-amber-900/70">
                  Sau khi chọn combo, AI sẽ tạo ảnh demo bếp realistic dựa trên thiết bị bạn chọn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black text-stone-900">{value}</div>
      <div className="text-xs uppercase tracking-wider text-stone-500">{label}</div>
    </div>
  );
}
