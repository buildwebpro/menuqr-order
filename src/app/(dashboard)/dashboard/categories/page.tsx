import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants, menuCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CategoriesManager } from "./CategoriesManager";
import { th } from "@/lib/i18n";

export default async function CategoriesPage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.userId, session.userId)).limit(1);
  if (!restaurant) return <div className="text-sm text-gray-500">สร้างร้านอาหารของคุณก่อนใน{th.restaurant.title}</div>;

  const categories = await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.restaurantId, restaurant.id))
    .orderBy(menuCategories.sortOrder, menuCategories.name);

  return <CategoriesManager restaurant={restaurant} categories={categories} />;
}
