import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password – MenuQR",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 font-bold text-xl mb-6">
            <UtensilsCrossed className="text-orange-500" size={28} />
            MenuQR
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 text-sm mt-1">
            We&apos;ll send you instructions to reset your password.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
              <Mail className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Password reset via email is coming soon. For now, please{" "}
                <a
                  href="mailto:support@menuqr.app"
                  className="text-orange-600 font-medium hover:underline"
                >
                  contact support
                </a>{" "}
                to reset your password.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link href="/auth/signin" className="text-orange-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
