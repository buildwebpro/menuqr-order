"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { eq, and } from "drizzle-orm";
import type { ActionResult } from "./auth";

const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  lineContact: z.string().optional(),
  googleMapsUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
});

export async function createRestaurantAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const rawSlug = formData.get("slug") as string || slugify(formData.get("name") as string || "");

  const raw = {
    name: formData.get("name") as string,
    slug: rawSlug,
    description: formData.get("description") as string || undefined,
    logoUrl: formData.get("logoUrl") as string || undefined,
    coverUrl: formData.get("coverUrl") as string || undefined,
    phone: formData.get("phone") as string || undefined,
    lineContact: formData.get("lineContact") as string || undefined,
    googleMapsUrl: formData.get("googleMapsUrl") as string || undefined,
    address: formData.get("address") as string || undefined,
    themeColor: formData.get("themeColor") as string || "#f97316",
  };

  const parsed = restaurantSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Check slug unique
  const existing = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.slug, parsed.data.slug))
    .limit(1);
  if (existing.length > 0) {
    return { success: false, error: "This URL slug is already taken. Please choose another." };
  }

  // Check if user already has a restaurant (free plan: max 1)
  const userRestaurants = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.userId, session.userId));
  if (userRestaurants.length >= 1) {
    return { success: false, error: "Free plan allows only 1 restaurant. Upgrade to Pro for more." };
  }

  const openingHours = formData.get("openingHours") as string | null;

  await db.insert(restaurants).values({
    userId: session.userId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    logoUrl: parsed.data.logoUrl || null,
    coverUrl: parsed.data.coverUrl || null,
    phone: parsed.data.phone || null,
    lineContact: parsed.data.lineContact || null,
    googleMapsUrl: parsed.data.googleMapsUrl || null,
    address: parsed.data.address || null,
    themeColor: parsed.data.themeColor,
    openingHours: openingHours || null,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/restaurant");
  return { success: true };
}

export async function updateRestaurantAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const restaurantId = formData.get("restaurantId") as string;

  // Verify ownership
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, session.userId)))
    .limit(1);

  if (!restaurant) return { success: false, error: "Restaurant not found" };

  const rawSlug = formData.get("slug") as string;

  const raw = {
    name: formData.get("name") as string,
    slug: rawSlug,
    description: formData.get("description") as string || undefined,
    logoUrl: formData.get("logoUrl") as string || undefined,
    coverUrl: formData.get("coverUrl") as string || undefined,
    phone: formData.get("phone") as string || undefined,
    lineContact: formData.get("lineContact") as string || undefined,
    googleMapsUrl: formData.get("googleMapsUrl") as string || undefined,
    address: formData.get("address") as string || undefined,
    themeColor: formData.get("themeColor") as string || "#f97316",
  };

  const parsed = restaurantSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Check slug unique (excluding current)
  if (parsed.data.slug !== restaurant.slug) {
    const existing = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.slug, parsed.data.slug))
      .limit(1);
    if (existing.length > 0) {
      return { success: false, error: "This URL slug is already taken." };
    }
  }

  const openingHours = formData.get("openingHours") as string | null;

  await db
    .update(restaurants)
    .set({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      logoUrl: parsed.data.logoUrl || null,
      coverUrl: parsed.data.coverUrl || null,
      phone: parsed.data.phone || null,
      lineContact: parsed.data.lineContact || null,
      googleMapsUrl: parsed.data.googleMapsUrl || null,
      address: parsed.data.address || null,
      themeColor: parsed.data.themeColor,
      openingHours: openingHours || null,
      updatedAt: new Date(),
    })
    .where(eq(restaurants.id, restaurantId));

  revalidatePath("/dashboard/restaurant");
  revalidatePath(`/menu/${parsed.data.slug}`);
  return { success: true };
}
