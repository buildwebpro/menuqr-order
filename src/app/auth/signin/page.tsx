import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ – MenuQR",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 font-bold text-xl mb-6">
            <UtensilsCrossed className="text-orange-500" size={28} />
            MenuQR
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">ยินดีต้อนรับกลับมา</h1>
          <p className="text-gray-500 text-sm mt-1">เข้าสู่ระบบแดชบอร์ดของคุณ</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <SignInForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {"ยังไม่มีบัญชี? "}
          <Link href="/auth/signup" className="text-orange-600 font-medium hover:underline">
            สมัครฟรี
          </Link>
        </p>
      </div>
    </div>
  );
}
