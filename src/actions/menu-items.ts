"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { menuItems, restaurants, userSubscriptions, subscriptionPlans } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { priceToCents } from "@/lib/utils";
import { eq, and, count } from "drizzle-orm";
import type { ActionResult } from "./auth";

const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().optional(),
  isAvailable: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

async function getRestaurantForUser(restaurantId: string, userId: string) {
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, userId)))
    .limit(1);
  return restaurant || null;
}

async function getUserPlan(userId: string) {
  const [sub] = await db
    .select({ plan: subscriptionPlans })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, "active")))
    .limit(1);
  return sub?.plan || null;
}

export async function createMenuItemAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurantId = formData.get("restaurantId") as string;
  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  // Check plan limits
  const plan = await getUserPlan(session.userId);
  if (plan?.maxMenuItems !== null && plan?.maxMenuItems !== undefined) {
    const [{ value: itemCount }] = await db
      .select({ value: count() })
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));
    if (itemCount >= plan.maxMenuItems) {
      return {
        success: false,
        error: `You've reached the ${plan.maxMenuItems} item limit on the Free plan. Upgrade to Pro for unlimited items.`,
      };
    }
  }

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || undefined,
    price: formData.get("price") as string,
    imageUrl: formData.get("imageUrl") as string || undefined,
    categoryId: formData.get("categoryId") as string || undefined,
    isAvailable: formData.get("isAvailable") !== "false",
    isFeatured: formData.get("isFeatured") === "true",
    sortOrder: formData.get("sortOrder") as string || "0",
  };

  const parsed = menuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await db.insert(menuItems).values({
    restaurantId,
    categoryId: parsed.data.categoryId || null,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: priceToCents(parsed.data.price),
    imageUrl: parsed.data.imageUrl || null,
    isAvailable: parsed.data.isAvailable,
    isFeatured: parsed.data.isFeatured,
    sortOrder: parsed.data.sortOrder,
  });

  revalidatePath("/dashboard/menu-items");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function updateMenuItemAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const itemId = formData.get("itemId") as string;
  const restaurantId = formData.get("restaurantId") as string;

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || undefined,
    price: formData.get("price") as string,
    imageUrl: formData.get("imageUrl") as string || undefined,
    categoryId: formData.get("categoryId") as string || undefined,
    isAvailable: formData.get("isAvailable") !== "false",
    isFeatured: formData.get("isFeatured") === "true",
    sortOrder: formData.get("sortOrder") as string || "0",
  };

  const parsed = menuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await db
    .update(menuItems)
    .set({
      categoryId: parsed.data.categoryId || null,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: priceToCents(parsed.data.price),
      imageUrl: parsed.data.imageUrl || null,
      isAvailable: parsed.data.isAvailable,
      isFeatured: parsed.data.isFeatured,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    })
    .where(and(eq(menuItems.id, itemId), eq(menuItems.restaurantId, restaurantId)));

  revalidatePath("/dashboard/menu-items");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function deleteMenuItemAction(
  itemId: string,
  restaurantId: string
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  await db
    .delete(menuItems)
    .where(and(eq(menuItems.id, itemId), eq(menuItems.restaurantId, restaurantId)));

  revalidatePath("/dashboard/menu-items");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function toggleItemAvailabilityAction(
  itemId: string,
  restaurantId: string,
  isAvailable: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  await db
    .update(menuItems)
    .set({ isAvailable, updatedAt: new Date() })
    .where(and(eq(menuItems.id, itemId), eq(menuItems.restaurantId, restaurantId)));

  revalidatePath("/dashboard/menu-items");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}
