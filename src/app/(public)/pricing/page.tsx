import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "แผนราคา – MenuQR",
  description: "แผนราคาแบบชัดเจนและโปร่งใส เริ่มต้นฟรีและอัปเกรดเมื่อคุณต้องการ",
};

const plans = [
  {
    id: "free",
    name: "ฟรี",
    price: 0,
    description: "เหมาะสำหรับการเริ่มต้น",
    badge: null,
    features: [
      "ร้านอาหาร 1 แห่ง",
      "รายการเมนูสูงสุด 20 รายการ",
      "สร้าง QR Code",
      "หน้าเมนูสาธารณะ",
      "ออกแบบเน้นมือถือ",
      "ปุ่มติดต่อ (โทร Line แผนที่)",
      "แสดงแบรนด์ MenuQR",
    ],
    notIncluded: ["ซ่อนแบรนด์ MenuQR", "สีธีมแบบกำหนดเอง", "รายการเมนูไม่จำกัด"],
    cta: "สมัครฟรี",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    description: "สำหรับร้านอาหารที่ต้องการมากขึ้น",
    badge: "ยอดนิยม",
    features: [
      "ร้านอาหาร 1 แห่ง",
      "รายการเมนูไม่จำกัด",
      "สร้าง QR Code",
      "หน้าเมนูสาธารณะ",
      "ออกแบบเน้นมือถือ",
      "ปุ่มติดต่อ (โทร Line แผนที่)",
      "ซ่อนแบรนด์ MenuQR",
      "สีธีมแบบกำหนดเอง",
      "ดำเนินการสนับสนุนลำดับความสำคัญ",
    ],
    notIncluded: [],
    cta: "อัปเกรดเป็น Pro",
    ctaHref: "/auth/signup",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            แผนราคาแบบชัดเจนและโปร่งใส
          </h1>
          <p className="text-lg text-gray-600">
            เริ่มต้นฟรี อัปเกรดเมื่อคุณต้องการมากขึ้น
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-8 relative ${
                plan.highlighted
                  ? "border-orange-500 shadow-xl shadow-orange-100"
                  : "border-gray-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Zap size={12} />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? "ฟรี" : `฿${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm">/เดือน</span>
                  )}
                </div>
              </div>

              <Link
                href={plan.ctaHref}
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm mb-8 transition-colors ${
                  plan.highlighted
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-3 opacity-40">
                    <Check size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500 line-through">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-gray-500 text-sm">
            ส่วนการชำระเงินจะมาเร็ว ๆ นี้ คุณสมบัติ Pro จะปลดล็อคสำหรับการทดสอบในขณะนี้
          </p>
        </div>
      </div>
    </main>
  );
}
