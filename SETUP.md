# Restaurant Online Menu - Setup & Deployment Guide

## 1) Local setup

```bash
bun install
cp .env.example .env.local
bun db:generate
bun typecheck
bun lint
bun dev
```

### Required environment variables

Create `.env.local`:

```env
JWT_SECRET=change-this-to-a-long-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For app-builder-db sandbox
DB_URL=...
DB_TOKEN=...

# Supabase (for production migration target)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 2) Supabase SQL schema + RLS + seed

Run this in Supabase SQL Editor.

```sql
-- extensions
create extension if not exists pgcrypto;

-- tables
create table if not exists public.subscription_plans (
  id text primary key,
  name text not null,
  max_menu_items integer,
  max_restaurants integer not null default 1,
  remove_branding boolean not null default false,
  custom_theme boolean not null default false,
  price_monthly integer not null default 0,
  description text
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  cover_url text,
  phone text,
  line_contact text,
  google_maps_url text,
  address text,
  opening_hours jsonb,
  theme_color text not null default '#f97316',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.subscription_plans(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price integer not null default 0,
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- storage buckets
insert into storage.buckets (id, name, public)
values ('restaurant-assets', 'restaurant-assets', true)
on conflict (id) do nothing;

-- RLS
alter table public.subscription_plans enable row level security;
alter table public.restaurants enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

-- plans readable for all authenticated
create policy "plans read" on public.subscription_plans
for select to authenticated
using (true);

-- restaurants owner-only CRUD, public read by slug page
create policy "restaurants owner read" on public.restaurants
for select to authenticated
using (auth.uid() = user_id);

create policy "restaurants owner insert" on public.restaurants
for insert to authenticated
with check (auth.uid() = user_id);

create policy "restaurants owner update" on public.restaurants
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "restaurants owner delete" on public.restaurants
for delete to authenticated
using (auth.uid() = user_id);

create policy "restaurants public read active" on public.restaurants
for select to anon
using (is_active = true);

-- user subscriptions owner read
create policy "subscriptions owner read" on public.user_subscriptions
for select to authenticated
using (auth.uid() = user_id);

create policy "subscriptions owner insert" on public.user_subscriptions
for insert to authenticated
with check (auth.uid() = user_id);

create policy "subscriptions owner update" on public.user_subscriptions
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- categories owner CRUD via restaurant ownership
create policy "categories owner read" on public.menu_categories
for select to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "categories owner insert" on public.menu_categories
for insert to authenticated
with check (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "categories owner update" on public.menu_categories
for update to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "categories owner delete" on public.menu_categories
for delete to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "categories public read visible" on public.menu_categories
for select to anon
using (
  is_visible = true and exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.is_active = true
  )
);

-- items owner CRUD via restaurant ownership
create policy "items owner read" on public.menu_items
for select to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "items owner insert" on public.menu_items
for insert to authenticated
with check (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "items owner update" on public.menu_items
for update to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "items owner delete" on public.menu_items
for delete to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.user_id = auth.uid()
  )
);

create policy "items public read" on public.menu_items
for select to anon
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.is_active = true
  )
);

-- storage policies
create policy "public read restaurant assets" on storage.objects
for select to anon
using (bucket_id = 'restaurant-assets');

create policy "owner upload restaurant assets" on storage.objects
for insert to authenticated
with check (bucket_id = 'restaurant-assets');

create policy "owner update restaurant assets" on storage.objects
for update to authenticated
using (bucket_id = 'restaurant-assets');

create policy "owner delete restaurant assets" on storage.objects
for delete to authenticated
using (bucket_id = 'restaurant-assets');

-- seed plans
insert into public.subscription_plans (id, name, max_menu_items, max_restaurants, remove_branding, custom_theme, price_monthly, description)
values
('free', 'Free', 20, 1, false, false, 0, 'Get started for free'),
('pro', 'Pro', null, 1, true, true, 29900, 'Unlimited items and remove branding')
on conflict (id) do update set
  name = excluded.name,
  max_menu_items = excluded.max_menu_items,
  max_restaurants = excluded.max_restaurants,
  remove_branding = excluded.remove_branding,
  custom_theme = excluded.custom_theme,
  price_monthly = excluded.price_monthly,
  description = excluded.description;
```

## 3) Deploy to Vercel + Supabase

1. Push repository to GitHub.
2. Import project into Vercel.
3. Set environment variables in Vercel project settings:
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to Vercel production URL)
   - `DB_URL`, `DB_TOKEN` (if using app-builder-db runtime)
   - Supabase variables if integrating client SDK
4. In Supabase:
   - Run SQL script above
   - Create bucket `restaurant-assets`
5. Redeploy from Vercel.

## 4) Future-ready architecture notes

Current structure supports extension to:
- online ordering (`orders`, `order_items`, `order_status_events` tables)
- payment integration (webhook handlers + payment_transactions)
- analytics (`menu_views`, `qr_scans`, `conversion_events`)
- multi-branch support (`branches`, `branch_menu_overrides`)
- staff accounts (`restaurant_staff`, role-based permissions)
