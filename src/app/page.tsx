import type { Metadata } from "next";
import Link from "next/link";
import {
  QrCode,
  Smartphone,
  Zap,
  Shield,
  UtensilsCrossed,
  ChevronRight,
  Star,
} from "lucide-react";
import { PublicNav } from "@/components/nav/PublicNav";

export const metadata: Metadata = {
  title: "MenuQR – สร้างเมนูออนไลน์และ QR Code สำหรับร้านอาหารของคุณ",
};

const features = [
  {
    icon: <UtensilsCrossed className="text-orange-500" size={24} />,
    title: "เมนูดิจิทัลที่สวยงาม",
    description:
      "สร้างเมนูออนไลน์ที่น่าดึงดูดพร้อมหมวดหมู่ รูปภาพ ราคา และคำอธิบายที่ดึงดูดลูกค้า",
  },
  {
    icon: <QrCode className="text-orange-500" size={24} />,
    title: "QR Code ทันที",
    description:
      "สร้าง QR Code ในเสี้ยววินาที ดาวน์โหลดและพิมพ์ที่โต๊ะ ใบเสร็จ หรือหน้าร้าน",
  },
  {
    icon: <Smartphone className="text-orange-500" size={24} />,
    title: "ออกแบบเน้นมือถือ",
    description:
      "เมนูของคุณมีลักษณะที่สวยงามบนทุกอุปกรณ์ ลูกค้าสามารถแสกน QR และเบราว์ได้อย่างสะดวก",
  },
  {
    icon: <Zap className="text-orange-500" size={24} />,
    title: "ใช้งานง่าย",
    description:
      "อัปเดตรายการเมนู ราคา และความพร้อมใช้งานแบบเรียลไทม์ ไม่ต้องมีทักษะทางเทคนิค",
  },
  {
    icon: <Shield className="text-orange-500" size={24} />,
    title: "ปลอดภัยและเชื่อถือได้",
    description:
      "ข้อมูลของคุณได้รับการป้องกัน เจ้าของร้านแต่ละรายมีแดชบอร์ดส่วนตัวของตนเอง",
  },
  {
    icon: <Star className="text-orange-500" size={24} />,
    title: "เริ่มต้นฟรี",
    description:
      "เริ่มต้นด้วยแผนฟรีของเรา อัปเกรดเป็น Pro เมื่อคุณต้องการคุณสมบัติเพิ่มเติม",
  },
];

export default function LandingPage() {
  return (
    <>
      <PublicNav />
      <main className="px-4 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">MenuQR – เมนูร้านอาหารออนไลน์</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">สร้างเมนูดิจิทัลที่สวยงาม สร้าง QR Code และปล่อยให้ลูกค้าเบราว์จากโทรศัพท์ของพวกเขา</p>
        <div className="flex gap-3 mb-16">
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">เริ่มต้นฟรี <ChevronRight size={16} /></Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">แผนราคา</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border rounded-xl p-5 hover:border-orange-200 hover:shadow-sm transition-all">
              {f.icon}
              <h3 className="font-semibold mt-3 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
