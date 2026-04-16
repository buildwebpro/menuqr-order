CREATE TABLE `menu_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`category_id` text,
	`name` text NOT NULL,
	`description` text,
	`price` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`is_available` integer DEFAULT true NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`logo_url` text,
	`cover_url` text,
	`phone` text,
	`line_contact` text,
	`google_maps_url` text,
	`address` text,
	`opening_hours` text,
	`theme_color` text DEFAULT '#f97316',
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `restaurants_slug_unique` ON `restaurants` (`slug`);--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`max_menu_items` integer,
	`max_restaurants` integer NOT NULL,
	`remove_branding` integer DEFAULT false NOT NULL,
	`custom_theme` integer DEFAULT false NOT NULL,
	`price_monthly` integer NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);