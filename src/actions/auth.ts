"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
import { users, subscriptionPlans, userSubscriptions } from "@/db/schema";
import { setSessionCookie, clearSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signUpAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;

  // Check if user exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning();

  // Ensure free plan exists
  const freePlanExists = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.id, "free"))
    .limit(1);

  if (freePlanExists.length === 0) {
    await db.insert(subscriptionPlans).values({
      id: "free",
      name: "Free",
      maxMenuItems: 20,
      maxRestaurants: 1,
      removeBranding: false,
      customTheme: false,
      priceMonthly: 0,
      description: "Get started for free",
    });
  }

  // Assign free plan
  await db.insert(userSubscriptions).values({
    userId: user.id,
    planId: "free",
    status: "active",
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  redirect("/dashboard");
}

export async function signInAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/auth/signin");
}
