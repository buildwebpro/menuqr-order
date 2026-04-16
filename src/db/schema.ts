import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  maxMenuItems: integer("max_menu_items"), // null = unlimited
  maxRestaurants: integer("max_restaurants").notNull(),
  removeBranding: integer("remove_branding", { mode: "boolean" })
    .notNull()
    .default(false),
  customTheme: integer("custom_theme", { mode: "boolean" })
    .notNull()
    .default(false),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  description: text("description"),
});

export const userSubscriptions = sqliteTable("user_subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id),
  status: text("status").notNull().default("active"), // active, cancelled, expired
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const restaurants = sqliteTable("restaurants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  phone: text("phone"),
  lineContact: text("line_contact"),
  googleMapsUrl: text("google_maps_url"),
  address: text("address"),
  openingHours: text("opening_hours"), // JSON string
  themeColor: text("theme_color").default("#f97316"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const menuCategories = sqliteTable("menu_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const menuItems = sqliteTable("menu_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => menuCategories.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull().default(0), // in cents
  imageUrl: text("image_url"),
  isAvailable: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export type User = typeof users.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
