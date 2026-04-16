import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants, menuItems, menuCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MenuItemsManager } from "./MenuItemsManager";
import { th } from "@/lib/i18n";

export default async function MenuItemsPage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.userId, session.userId)).limit(1);
  if (!restaurant) return <div className="text-sm text-gray-500">สร้างร้านอาหารของคุณก่อนใน{th.restaurant.title}</div>;

  const [items, categories] = await Promise.all([
    db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurant.id)).orderBy(menuItems.sortOrder, menuItems.name),
    db.select().from(menuCategories).where(eq(menuCategories.restaurantId, restaurant.id)).orderBy(menuCategories.sortOrder, menuCategories.name),
  ]);

  return <MenuItemsManager restaurant={restaurant} items={items} categories={categories} />;
}
