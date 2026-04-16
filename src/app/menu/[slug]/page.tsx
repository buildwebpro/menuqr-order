import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, MapPin, MessageCircle, Clock, UtensilsCrossed } from "lucide-react";
import { db } from "@/db";
import { restaurants, menuCategories, menuItems, userSubscriptions, subscriptionPlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { formatPrice, parseOpeningHours } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.slug, slug), eq(restaurants.isActive, true)))
    .limit(1);

  if (!restaurant) return { title: "Menu Not Found" };

  return {
    title: `${restaurant.name} – Menu`,
    description: restaurant.description || `Browse the menu for ${restaurant.name}`,
    openGraph: {
      title: `${restaurant.name} – Menu`,
      description: restaurant.description || `Browse the menu for ${restaurant.name}`,
      images: restaurant.coverUrl ? [restaurant.coverUrl] : [],
    },
  };
}

export default async function PublicMenuPage({ params }: Props) {
  const { slug } = await params;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.slug, slug), eq(restaurants.isActive, true)))
    .limit(1);

  if (!restaurant) notFound();

  // Get subscription to check branding
  const [sub] = await db
    .select({ plan: subscriptionPlans })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(and(eq(userSubscriptions.userId, restaurant.userId), eq(userSubscriptions.status, "active")))
    .limit(1);

  const showBranding = !sub?.plan.removeBranding;
  const themeColor = sub?.plan.customTheme ? (restaurant.themeColor || "#f97316") : "#f97316";

  const categories = await db
    .select()
    .from(menuCategories)
    .where(and(eq(menuCategories.restaurantId, restaurant.id), eq(menuCategories.isVisible, true)))
    .orderBy(menuCategories.sortOrder, menuCategories.name);

  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurant.id))
    .orderBy(menuItems.sortOrder, menuItems.name);

  const openingHours = parseOpeningHours(restaurant.openingHours);
  const featuredItems = items.filter((i) => i.isFeatured && i.isAvailable);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover + Header */}
      <div className="relative">
        {restaurant.coverUrl ? (
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <Image
              src={restaurant.coverUrl}
              alt={`${restaurant.name} cover`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div
            className="h-24 sm:h-32"
            style={{ backgroundColor: themeColor }}
          />
        )}

        <div className="max-w-2xl mx-auto px-4 pb-4 relative">
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-end gap-4 ${restaurant.coverUrl ? "-mt-12" : "pt-4"}`}
          >
            <div className="flex-shrink-0">
              {restaurant.logoUrl ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={restaurant.logoUrl}
                    alt={`${restaurant.name} logo`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <UtensilsCrossed className="text-white" size={32} />
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
              {restaurant.description && (
                <p className="text-gray-500 text-sm mt-0.5">{restaurant.description}</p>
              )}
              {restaurant.address && (
                <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} />
                  {restaurant.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {(restaurant.phone || restaurant.lineContact || restaurant.googleMapsUrl) && (
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="flex gap-2 flex-wrap">
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                style={{ color: themeColor }}
              >
                <Phone size={14} />
                Call
              </a>
            )}
            {restaurant.lineContact && (
              <a
                href={`https://line.me/ti/p/${restaurant.lineContact.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                style={{ color: themeColor }}
              >
                <MessageCircle size={14} />
                Line
              </a>
            )}
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                style={{ color: themeColor }}
              >
                <MapPin size={14} />
                Map
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Featured items */}
        {featuredItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              ⭐ Featured
            </h2>
            <div className="grid gap-3">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} themeColor={themeColor} />
              ))}
            </div>
          </section>
        )}

        {/* Categories with items */}
        {categories.length === 0 && items.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Menu coming soon</p>
          </div>
        ) : (
          <>
            {categories.map((cat) => {
              const catItems = items.filter(
                (i) => i.categoryId === cat.id
              );
              if (catItems.length === 0) return null;
              return (
                <section key={cat.id} id={`cat-${cat.id}`} className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
                  )}
                  <div className="grid gap-3">
                    {catItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} themeColor={themeColor} />
                    ))}
                  </div>
                </section>
              );
            })}
            {/* Uncategorized items */}
            {(() => {
              const uncategorized = items.filter((i) => !i.categoryId);
              if (uncategorized.length === 0) return null;
              return (
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Other Items</h2>
                  <div className="grid gap-3">
                    {uncategorized.map((item) => (
                      <MenuItemCard key={item.id} item={item} themeColor={themeColor} />
                    ))}
                  </div>
                </section>
              );
            })()}
          </>
        )}

        {/* Opening hours */}
        {restaurant.openingHours && (
          <section className="mt-8 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Opening Hours
            </h2>
            <div className="grid gap-1.5">
              {openingHours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-gray-600">{h.day}</span>
                  <span className={h.isClosed ? "text-red-500" : "text-gray-900 font-medium"}>
                    {h.isClosed ? "Closed" : `${h.open} – ${h.close}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Branding footer */}
      {showBranding && (
        <div className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-white/90 backdrop-blur border-t border-gray-200 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <UtensilsCrossed size={12} className="text-orange-500" />
          Powered by <span className="font-semibold text-orange-500">MenuQR</span>
        </div>
      )}
    </div>
  );
}

function MenuItemCard({
  item,
  themeColor,
}: {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
  };
  themeColor: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 flex gap-3 overflow-hidden ${
        !item.isAvailable ? "opacity-60" : ""
      }`}
    >
      {item.imageUrl && (
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 py-3 px-3 pr-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</h3>
            {item.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
            )}
            {!item.isAvailable && (
              <span className="inline-block mt-1 text-xs text-red-500 font-medium">Unavailable</span>
            )}
          </div>
          <span
            className="text-base font-bold flex-shrink-0"
            style={{ color: themeColor }}
          >
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
