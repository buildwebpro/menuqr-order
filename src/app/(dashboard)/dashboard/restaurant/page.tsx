import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RestaurantForm } from "./RestaurantForm";
import { th } from "@/lib/i18n";

export const metadata: Metadata = { title: "การตั้งค่าร้านอาหาร – MenuQR" };

export default async function RestaurantPage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.userId, session.userId))
    .limit(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{th.restaurant.title}</h1>
        <p className="text-gray-500">{th.restaurant.description}</p>
      </div>
      <RestaurantForm restaurant={restaurant ?? null} />
    </div>
  );
}
