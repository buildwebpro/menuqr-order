import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RestaurantForm } from "./RestaurantForm";

export const metadata: Metadata = { title: "Restaurant Settings" };

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
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
        <p className="text-gray-500">Manage your restaurant profile and public menu details.</p>
      </div>
      <RestaurantForm restaurant={restaurant ?? null} />
    </div>
  );
}
