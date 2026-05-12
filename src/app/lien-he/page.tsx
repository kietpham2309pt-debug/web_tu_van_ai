import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { SHOP_ADDRESS, SHOP_EMAIL, SHOP_PHONE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Liên hệ & đặt lịch khảo sát",
  description:
    "Đặt lịch khảo sát tại nhà với BNB — đo kích thước tủ bếp, kiểm tra điện nước, đề xuất combo phù hợp với không gian thực tế.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Liên hệ Bếp Ngọc Bảo</h1>
      <p className="mt-2 text-stone-600">
        Đặt lịch khảo sát tại nhà miễn phí · Gọi Zalo · Đến showroom xem trực tiếp.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Showroom</h2>
          <ul className="space-y-4 text-sm text-stone-700">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
              <div>
                <div className="font-semibold text-stone-900">Địa chỉ</div>
                <div>{SHOP_ADDRESS}</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
              <div>
                <div className="font-semibold text-stone-900">Hotline</div>
                <a
                  href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}
                  className="text-amber-800 hover:underline"
                >
                  {SHOP_PHONE}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
              <div>
                <div className="font-semibold text-stone-900">Email</div>
                <a href={`mailto:${SHOP_EMAIL}`} className="text-amber-800 hover:underline">
                  {SHOP_EMAIL}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
              <div>
                <div className="font-semibold text-stone-900">Giờ mở cửa</div>
                <div>8:30 - 21:00 (T2 - CN)</div>
              </div>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-700"
            >
              <Phone className="h-4 w-4" />
              Gọi ngay {SHOP_PHONE}
            </a>
            <a
              href={`https://zalo.me/${SHOP_PHONE.replace(/\s/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 hover:border-stone-400"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Zalo
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

function ContactForm() {
  return (
    <form
      action={`mailto:${SHOP_EMAIL}`}
      method="post"
      encType="text/plain"
      className="rounded-2xl border border-stone-200 bg-white p-6"
    >
      <h2 className="mb-4 text-xl font-bold">Đặt lịch khảo sát tại nhà</h2>
      <div className="space-y-3">
        <Field label="Họ và tên" name="name" required />
        <Field label="Số điện thoại / Zalo" name="phone" type="tel" required />
        <Field label="Khu vực (Quận / Thành phố)" name="area" />
        <Field label="Loại nhà" name="house" />
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-600">
            Mô tả nhu cầu
          </label>
          <textarea
            name="message"
            rows={4}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
            placeholder="Ví dụ: chung cư 80m², ngân sách 40tr, muốn có máy rửa chén..."
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white hover:bg-stone-700"
      >
        Gửi yêu cầu
      </button>
      <p className="mt-3 text-xs text-stone-500">
        BNB sẽ liên hệ lại trong vòng 4 giờ làm việc. Khảo sát miễn phí toàn TP.HCM.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-600">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
      />
    </div>
  );
}
