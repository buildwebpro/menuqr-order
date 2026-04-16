import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing – MenuQR",
  description: "Simple, transparent pricing. Start free, upgrade when you need more.",
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    badge: null,
    features: [
      "1 restaurant",
      "Up to 20 menu items",
      "QR code generation",
      "Public menu page",
      "Mobile-friendly design",
      "Contact buttons (call, Line, map)",
      "MenuQR branding",
    ],
    notIncluded: ["Remove MenuQR branding", "Custom theme color", "Unlimited menu items"],
    cta: "Get started free",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    description: "For restaurants that need more",
    badge: "Most Popular",
    features: [
      "1 restaurant",
      "Unlimited menu items",
      "QR code generation",
      "Public menu page",
      "Mobile-friendly design",
      "Contact buttons (call, Line, map)",
      "Remove MenuQR branding",
      "Custom theme color",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Upgrade to Pro",
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
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600">
            Start for free. Upgrade when you need more.
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
                    {plan.price === 0 ? "Free" : `฿${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm">/month</span>
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
            Billing integration coming soon. Pro features currently unlocked for testing.
          </p>
        </div>
      </div>
    </main>
  );
}
