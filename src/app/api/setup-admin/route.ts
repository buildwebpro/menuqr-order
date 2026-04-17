import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, subscriptionPlans, userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "admin@menuqr.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_NAME = "Admin";

export async function GET() {
  // Check if admin already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ message: "Admin account already exists" });
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const [user] = await db
    .insert(users)
    .values({ name: ADMIN_NAME, email: ADMIN_EMAIL, passwordHash })
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

  await db.insert(userSubscriptions).values({
    userId: user.id,
    planId: "free",
    status: "active",
  });

  return NextResponse.json({
    message: "Admin account created successfully",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
}
