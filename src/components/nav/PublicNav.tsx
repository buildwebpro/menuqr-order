import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { getSession } from "@/lib/auth";

export async function PublicNav() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <UtensilsCrossed className="text-orange-500" size={24} />
          <span>MenuQR</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors hidden sm:inline-flex"
          >
            Pricing
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
