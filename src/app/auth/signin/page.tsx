import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In – MenuQR",
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <SignInForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {"Don't have an account? "}
          <Link href="/auth/signup" className="text-orange-600 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
