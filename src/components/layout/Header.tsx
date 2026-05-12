"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { BNB_LOGO, bnbCollectionUrl } from "@/lib/seo";

type NavItem = {
  href: string;
  label: string;
  highlight?: boolean;
  external?: boolean;
};

const NAV: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/tu-van-ai", label: "Tư vấn AI", highlight: true },
  { href: "/demo-bep", label: "Demo bếp AI", highlight: true },
  { href: bnbCollectionUrl("all"), label: "Sản phẩm", external: true },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Bếp Ngọc Bảo">
          <Image
            src={BNB_LOGO}
            alt="Bếp Ngọc Bảo"
            width={400}
            height={61}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                {item.label}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  item.highlight
                    ? "text-amber-800 hover:bg-amber-50"
                    : "text-stone-700 hover:bg-stone-100"
                )}
              >
                {item.highlight && <Sparkles className="mr-1 inline h-3.5 w-3.5" />}
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/tu-van-ai"
            className="ml-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            Bắt đầu tư vấn
          </Link>
        </nav>

        <button
          aria-label="Mở menu"
          className="rounded-lg p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-700"
                >
                  {item.label}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/tu-van-ai"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-stone-900 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Bắt đầu tư vấn
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
