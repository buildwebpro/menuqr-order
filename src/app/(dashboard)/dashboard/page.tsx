import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants, menuItems, menuCategories, userSubscriptions, subscriptionPlans } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { Store, UtensilsCrossed, LayoutList, QrCode, ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { th } from "@/lib/i18n";

export const metadata: Metadata = { title: "แดชบอร์ด – MenuQR" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.userId, session.userId))
    .limit(1);

  const [sub] = await db
    .select({ plan: subscriptionPlans })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(and(eq(userSubscriptions.userId, session.userId), eq(userSubscriptions.status, "active")))
    .limit(1);

  const plan = sub?.plan;

  let itemCount = 0;
  let categoryCount = 0;

  if (restaurant) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurant.id));
    itemCount = value;

    const [{ value: catValue }] = await db
      .select({ value: count() })
      .from(menuCategories)
      .where(eq(menuCategories.restaurantId, restaurant.id));
    categoryCount = catValue;
  }

  const itemLimit = plan?.maxMenuItems;
  const itemsUsedPercent = itemLimit ? Math.min((itemCount / itemLimit) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {th.dashboard.welcome} {session.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">{th.dashboard.overviewMenu}</p>
      </div>

      {/* Plan badge */}
      <div className="mb-6 flex items-center gap-3">
        <Badge variant={plan?.id === "pro" ? "success" : "default"}>
          {plan?.name || th.subscription.free} {th.general.add}
        </Badge>
        {plan?.id !== "pro" && (
          <Link href="/dashboard/subscription" className="text-xs text-orange-600 font-medium hover:underline flex items-center gap-1">
            {th.dashboard.upgradeToPro} <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {!restaurant ? (
        /* No restaurant yet */
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-orange-500" size={28} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{th.restaurant.setupYourRestaurant}</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            {th.restaurant.setupRestaurantDescription}
          </p>
          <Link
            href="/dashboard/restaurant"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Plus size={16} />
            {th.restaurant.createRestaurant}
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<UtensilsCrossed size={20} className="text-orange-500" />}
              label={th.dashboard.menuItems}
              value={itemCount}
              subtext={itemLimit ? `/ ${itemLimit}` : th.general.unlimited}
              href="/dashboard/menu-items"
            />
            <StatCard
              icon={<LayoutList size={20} className="text-blue-500" />}
              label={th.sidebar.categories}
              value={categoryCount}
              href="/dashboard/categories"
            />
            <StatCard
              icon={<QrCode size={20} className="text-green-500" />}
              label={th.dashboard.publicMenu}
              value="เปิด"
              subtext={th.dashboard.scanToView}
              href="/dashboard/qr-code"
            />
          </div>

          {/* Free plan limit */}
          {itemLimit && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">{th.dashboard.usageLimit}</span>
                <span className="text-gray-500">{itemCount} / {itemLimit}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${itemsUsedPercent}%` }}
                />
              </div>
              {itemCount >= itemLimit && (
                <p className="text-xs text-red-600 mt-2">
                  {th.dashboard.itemLimit}{" "}
                  <Link href="/dashboard/subscription" className="underline font-medium">
                    {th.dashboard.upgradeToPro}
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickLink
              href="/dashboard/menu-items"
              icon={<UtensilsCrossed size={18} className="text-orange-500" />}
              title={th.dashboard.manageMenuItems}
              description={th.dashboard.addEditUpdate}
            />
            <QuickLink
              href="/dashboard/categories"
              icon={<LayoutList size={18} className="text-blue-500" />}
              title={th.dashboard.manageCategories}
              description={th.dashboard.organizeMenuSections}
            />
            <QuickLink
              href="/dashboard/qr-code"
              icon={<QrCode size={18} className="text-green-500" />}
              title="ดู & ดาวน์โหลด QR Code"
              description="พิมพ์เพื่อโต๊ะของคุณ"
            />
            <QuickLink
              href={`/menu/${restaurant.slug}`}
              icon={<Store size={18} className="text-purple-500" />}
              title={th.dashboard.viewPublicMenu}
              description={th.dashboard.seeWhatCustomersSee}
              external
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-200 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        {icon}
        <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </Link>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-orange-200 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors mt-0.5 ml-auto flex-shrink-0" />
    </Link>
  );
}
