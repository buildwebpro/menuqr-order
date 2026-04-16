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
  title: "MenuQR – Create Your Restaurant's Online Menu & QR Code",
};

const features = [
  {
    icon: <UtensilsCrossed className="text-orange-500" size={24} />,
    title: "Beautiful Digital Menu",
    description:
      "Create a stunning online menu with categories, images, prices, and descriptions that delight your customers.",
  },
  {
    icon: <QrCode className="text-orange-500" size={24} />,
    title: "Instant QR Code",
    description:
      "Generate a QR code in seconds. Download it and print it on your tables, receipts, or storefront.",
  },
  {
    icon: <Smartphone className="text-orange-500" size={24} />,
    title: "Mobile-First Design",
    description:
      "Your menu looks amazing on every device. Customers scan and browse comfortably on their phones.",
  },
  {
    icon: <Zap className="text-orange-500" size={24} />,
    title: "Easy to Manage",
    description:
      "Update menu items, prices, and availability in real time — no technical skills needed.",
  },
  {
    icon: <Shield className="text-orange-500" size={24} />,
    title: "Secure & Reliable",
    description:
      "Your data is protected. Each restaurant owner has their own private dashboard.",
  },
  {
    icon: <Star className="text-orange-500" size={24} />,
    title: "Free to Start",
    description:
      "Get started with our free plan. Upgrade to Pro when you need more features.",
  },
];

export default function LandingPage() {
  return (
    <>
      <PublicNav />
      <main className="px-4 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Restaurant Online Menu SaaS</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">Create a beautiful digital menu, generate a QR code, and let customers browse from their phones.</p>
        <div className="flex gap-3 mb-16">
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg">Get Started <ChevronRight size={16} /></Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg">Pricing</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border rounded-xl p-5">
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
