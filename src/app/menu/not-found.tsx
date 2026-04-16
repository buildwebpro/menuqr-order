import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <UtensilsCrossed className="text-orange-300 mb-6" size={56} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu not found</h1>
      <p className="text-gray-500 mb-8">
        This restaurant menu doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
      >
        Go to homepage
      </Link>
    </div>
  );
}
