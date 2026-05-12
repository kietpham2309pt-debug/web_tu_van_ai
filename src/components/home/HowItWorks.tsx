import { MessageSquareText, Sparkles, ImagePlus, Phone } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "1. Trả lời 5 câu vàng",
    body: "Loại nhà, tình trạng, gia đình, ngân sách, ưu tiên. Không cần đăng nhập, không cần điền form dài.",
  },
  {
    icon: Sparkles,
    title: "2. AI khớp 1 trong 12 kịch bản",
    body: "Hệ thống dùng playbook BNB (đã train 535 SKU) để đề xuất combo Good/Better/Best.",
  },
  {
    icon: ImagePlus,
    title: "3. AI vẽ căn bếp của bạn",
    body: "Sinh ảnh demo realistic căn bếp có chính các thiết bị bạn vừa chọn — trước khi mua.",
  },
  {
    icon: Phone,
    title: "4. Khảo sát tại nhà / Chốt đơn",
    body: "Lưu cấu hình, gọi Zalo BNB hoặc đặt lịch khảo sát đo đạc miễn phí.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-10 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-amber-800">
          QUY TRÌNH 7 BƯỚC CỦA BNB · SỐ HOÁ
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          AI thay thế 5 phút khám phá đầu tiên ở showroom
        </h2>
        <p className="mt-3 text-stone-600">
          Phần khám phá nhu cầu giờ đây nhanh hơn, chính xác hơn — nhân viên BNB tiếp tục bước
          trải nghiệm và chốt đơn.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-700 group-hover:text-white">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">{s.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
