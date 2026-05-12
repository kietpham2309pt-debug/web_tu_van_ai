"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2, Loader2, Download } from "lucide-react";
import type { ComboTierData, Scenario } from "@/types";
import type { KitchenLayout, KitchenStyle } from "@/lib/kitchen-prompt";
import { LAYOUTS, STYLES } from "@/lib/kitchen-prompt";
import type { Element } from "@/lib/feng-shui-meta";
import { BNB_LOGO } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import type { ContractItem } from "@/lib/contract-pdf";

const ELEMENT_LABEL: Record<Element, string> = {
  Kim: "Kim",
  Moc: "Mộc",
  Thuy: "Thuỷ",
  Hoa: "Hoả",
  Tho: "Thổ",
};

type Props = {
  open: boolean;
  onClose: () => void;
  scenario: Scenario;
  tier: ComboTierData;
  layout: KitchenLayout;
  style: KitchenStyle;
  element?: Element;
  imageDataUrl: string;
};

function genOrderCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BNB-${yyyy}${mm}${dd}-${rand}`;
}

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function slugSafe(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

export default function OrderConfirmModal({
  open,
  onClose,
  scenario,
  tier,
  layout,
  style,
  element,
  imageDataUrl,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ContractItem[]>([]);
  const [installFee, setInstallFee] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderCode] = useState(() => genOrderCode());

  useEffect(() => {
    setItems(
      tier.items.map((it) => ({
        name: `${it.role}: ${it.fallbackName}`,
        sku: it.sku || "",
        qty: 1,
        price: it.refPrice,
      }))
    );
  }, [tier]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const total = subtotal + installFee + shippingFee - discount;

  function updateItem(idx: number, patch: Partial<ContractItem>) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: "Sản phẩm mới", sku: "", qty: 1, price: 0 },
    ]);
  }

  async function handleGenerate() {
    setErr(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErr("Vui lòng nhập đầy đủ Họ tên, SĐT và Địa chỉ giao hàng.");
      return;
    }
    if (items.length === 0) {
      setErr("Cần có ít nhất 1 thiết bị trong đơn.");
      return;
    }
    setGenerating(true);
    try {
      const [{ pdf }, { ContractPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/contract-pdf"),
      ]);

      const layoutLabel =
        LAYOUTS.find((l) => l.id === layout)?.label || layout;
      const styleLabel = STYLES.find((s) => s.id === style)?.label || style;

      const blob = await pdf(
        <ContractPDF
          data={{
            customer: {
              name: name.trim(),
              phone: phone.trim(),
              email: email.trim() || undefined,
              address: address.trim(),
              note: note.trim() || undefined,
            },
            order: {
              code: orderCode,
              date: todayStr(),
              scenarioId: scenario.id,
              scenarioTitle: scenario.title,
              tier: tier.tier,
              tierLabel: tier.label,
              layout: layoutLabel,
              style: styleLabel,
              element: element ? ELEMENT_LABEL[element] : undefined,
            },
            imageDataUrl,
            items,
            fees: {
              install: installFee,
              shipping: shippingFee,
              discount,
            },
            logoUrl: BNB_LOGO,
          }}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${orderCode}_${slugSafe(name) || "khach"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "Lỗi tạo PDF";
      setErr(m);
    } finally {
      setGenerating(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Mã đơn · {orderCode}
            </div>
            <h2 className="text-lg font-black">
              Xuất biên bản xác nhận đơn hàng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-160px)] overflow-y-auto px-6 py-5">
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
              Thông tin khách hàng
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Họ tên *">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <Field label="Số điện thoại *">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901xxxxxx"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <Field label="Email (tuỳ chọn)">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <Field label="Địa chỉ giao hàng *">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, phường, quận, TP"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Ghi chú thêm (tuỳ chọn)">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="VD: lắp đặt sau 15h, gọi trước 30 phút..."
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Danh sách thiết bị ({items.length})
              </h3>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:border-stone-500"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm dòng
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-600">
                  <tr>
                    <th className="w-10 px-2 py-2 text-center">#</th>
                    <th className="px-2 py-2 text-left">Sản phẩm</th>
                    <th className="w-28 px-2 py-2 text-left">SKU</th>
                    <th className="w-16 px-2 py-2 text-center">SL</th>
                    <th className="w-32 px-2 py-2 text-right">Đơn giá</th>
                    <th className="w-32 px-2 py-2 text-right">Thành tiền</th>
                    <th className="w-8 px-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-stone-200 align-top"
                    >
                      <td className="px-2 py-2 text-center text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={it.name}
                          onChange={(e) =>
                            updateItem(idx, { name: e.target.value })
                          }
                          className="w-full rounded border border-stone-200 px-2 py-1 text-sm focus:border-amber-700 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={it.sku}
                          onChange={(e) =>
                            updateItem(idx, { sku: e.target.value })
                          }
                          className="w-full rounded border border-stone-200 px-2 py-1 text-xs focus:border-amber-700 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) =>
                            updateItem(idx, {
                              qty: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          className="w-full rounded border border-stone-200 px-2 py-1 text-center text-sm focus:border-amber-700 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          step={100000}
                          value={it.price}
                          onChange={(e) =>
                            updateItem(idx, {
                              price: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-full rounded border border-stone-200 px-2 py-1 text-right text-sm focus:border-amber-700 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2 text-right text-sm font-semibold">
                        {formatPrice(it.price * it.qty)}
                      </td>
                      <td className="px-1 py-2 text-center">
                        <button
                          onClick={() => removeItem(idx)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          aria-label="Xoá"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-sm text-stone-500"
                      >
                        Chưa có thiết bị. Bấm "Thêm dòng" để thêm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
              Phí & giảm giá
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Phí lắp đặt (₫)">
                <input
                  type="number"
                  min={0}
                  step={100000}
                  value={installFee}
                  onChange={(e) =>
                    setInstallFee(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <Field label="Phí vận chuyển (₫)">
                <input
                  type="number"
                  min={0}
                  step={100000}
                  value={shippingFee}
                  onChange={(e) =>
                    setShippingFee(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
              <Field label="Giảm giá (₫)">
                <input
                  type="number"
                  min={0}
                  step={100000}
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl bg-amber-50/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-700">Tổng tiền hàng</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {installFee > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-stone-700">+ Lắp đặt</span>
                <span>{formatPrice(installFee)}</span>
              </div>
            )}
            {shippingFee > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-stone-700">+ Vận chuyển</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-stone-700">− Giảm giá</span>
                <span className="text-red-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-amber-300 pt-2 text-base">
              <span className="font-bold">Tổng thanh toán</span>
              <span className="text-lg font-black text-amber-800">
                {formatPrice(total)}
              </span>
            </div>
          </section>

          {err && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {err}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {generating ? "Đang tạo PDF..." : "Tạo & tải PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-stone-600">
        {label}
      </label>
      {children}
    </div>
  );
}
