"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { menuCategories, restaurants } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import type { ActionResult } from "./auth";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isVisible: z.coerce.boolean().default(true),
});

async function getRestaurantForUser(restaurantId: string, userId: string) {
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, userId)))
    .limit(1);
  return restaurant || null;
}

export async function createCategoryAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurantId = formData.get("restaurantId") as string;
  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || undefined,
    sortOrder: formData.get("sortOrder") as string || "0",
    isVisible: formData.get("isVisible") !== "false",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await db.insert(menuCategories).values({
    restaurantId,
    name: parsed.data.name,
    description: parsed.data.description || null,
    sortOrder: parsed.data.sortOrder,
    isVisible: parsed.data.isVisible,
  });

  revalidatePath("/dashboard/categories");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function updateCategoryAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const categoryId = formData.get("categoryId") as string;
  const restaurantId = formData.get("restaurantId") as string;

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || undefined,
    sortOrder: formData.get("sortOrder") as string || "0",
    isVisible: formData.get("isVisible") !== "false",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await db
    .update(menuCategories)
    .set({
      name: parsed.data.name,
      description: parsed.data.description || null,
      sortOrder: parsed.data.sortOrder,
      isVisible: parsed.data.isVisible,
      updatedAt: new Date(),
    })
    .where(and(eq(menuCategories.id, categoryId), eq(menuCategories.restaurantId, restaurantId)));

  revalidatePath("/dashboard/categories");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function deleteCategoryAction(
  categoryId: string,
  restaurantId: string
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  await db
    .delete(menuCategories)
    .where(and(eq(menuCategories.id, categoryId), eq(menuCategories.restaurantId, restaurantId)));

  revalidatePath("/dashboard/categories");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}

export async function toggleCategoryVisibilityAction(
  categoryId: string,
  restaurantId: string,
  isVisible: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurant = await getRestaurantForUser(restaurantId, session.userId);
  if (!restaurant) return { success: false, error: "Restaurant not found" };

  await db
    .update(menuCategories)
    .set({ isVisible, updatedAt: new Date() })
    .where(and(eq(menuCategories.id, categoryId), eq(menuCategories.restaurantId, restaurantId)));

  revalidatePath("/dashboard/categories");
  revalidatePath(`/menu/${restaurant.slug}`);
  return { success: true };
}
