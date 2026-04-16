# Restaurant Online Menu - Multi-Tenant SaaS Platform

A modern, self-service platform that allows restaurant owners to create beautiful online menus and share them with customers via QR codes. Built with Next.js, TypeScript, Tailwind CSS, and Drizzle ORM.

## 🎯 Features

### For Restaurant Owners
- **Dashboard**: Manage your entire restaurant menu from a clean, intuitive dashboard
- **Restaurant Profile**: Customize your restaurant name, logo, cover image, description, contact info, and theme color
- **Menu Management**: 
  - Create unlimited categories (Free plan: 20 items, Pro: unlimited)
  - Add menu items with images, descriptions, and prices
  - Toggle item availability in real-time
  - Drag-and-sort ordering (sortOrder field in DB)
  - Mark items as featured
- **QR Code Generation**: Instantly generate downloadable QR codes linking to your public menu
- **Subscription Plans**: 
  - Free: 1 restaurant, 20 items, platform branding
  - Pro: 1 restaurant, unlimited items, remove branding, custom theme color
- **Multi-Tenant Architecture**: Each restaurant owner has their own isolated dashboard

### For Customers
- **Public Menu Pages**: Beautiful, mobile-first menu pages accessible by QR code
- **Fast Loading**: Optimized for quick browsing on any device
- **Quick Actions**: Call, Line, and Google Maps buttons for easy contact
- **Opening Hours**: View restaurant hours at a glance
- **Feature Display**: Restaurant branding, logo, and description front and center

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or Bun 1.3+
- Git

### Local Development

```bash
# Clone and install
git clone <repo-url>
cd restaurant-online-menu
bun install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your JWT_SECRET and database credentials

# Generate database migrations
bun db:generate

# Run development server
bun dev
```

Visit http://localhost:3000 to see the application.

### Test Accounts

The application uses JWT-based authentication. Create accounts via the signup page:
- **URL**: http://localhost:3000/auth/signup
- Password minimum: 8 characters

## 📋 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public pages (landing, pricing)
│   ├── (dashboard)/               # Protected dashboard pages
│   ├── auth/                      # Authentication pages
│   └── menu/[slug]/               # Public restaurant menu pages
├── actions/                       # Server actions for CRUD operations
│   ├── auth.ts                    # Authentication
│   ├── restaurant.ts              # Restaurant management
│   ├── categories.ts              # Menu categories
│   └── menu-items.ts              # Menu items
├── components/                    # Reusable React components
│   ├── ui/                        # Base UI components (Button, Input, etc.)
│   ├── nav/                       # Navigation components
│   ├── EmptyState.tsx             # Empty state fallback
│   └── QRCodeDisplay.tsx          # QR code generation and download
├── db/                            # Database layer
│   ├── schema.ts                  # Drizzle table definitions
│   ├── index.ts                   # DB client export
│   ├── migrate.ts                 # Migration runner
│   └── migrations/                # SQL migration files
├── lib/                           # Utilities and helpers
│   ├── auth.ts                    # JWT and session management
│   └── utils.ts                   # Price formatting, slugs, etc.
├── middleware.ts                  # Protected route guards
└── globals.css                    # Tailwind CSS imports
```

## 🔐 Authentication & Security

- **JWT-based Sessions**: Secure cookie-based authentication
- **Middleware Protection**: Dashboard routes redirected to signin if not authenticated
- **Password Hashing**: Bcryptjs for secure password storage
- **Row-Level Security**: Ready-to-deploy with Supabase RLS policies (see SETUP.md)

## 💾 Database Schema

### Tables
- **users**: User accounts with hashed passwords
- **subscription_plans**: Free and Pro tier definitions
- **user_subscriptions**: Active plan assignments
- **restaurants**: Restaurant profiles
- **menu_categories**: Menu sections
- **menu_items**: Individual dishes

See `src/db/schema.ts` for full schema definition.

## 🌐 Deployment

### Vercel + Supabase

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Set environment variables (see `.env.example`)

3. **Setup Supabase**
   - Create Supabase project
   - Run SQL from `SETUP.md` to create tables and RLS policies
   - Create storage bucket: `restaurant-assets`

4. **Deploy**
   - Vercel will auto-deploy on `main` push
   - Database runs automatically in Supabase

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 🎨 UI/UX Highlights

- **Clean Modern Design**: Orange accent color with neutral grays
- **Mobile-First**: All pages optimized for mobile browsing
- **Responsive Layout**: Dashboard sidebar collapses on mobile
- **Loading States**: Visual feedback during form submissions
- **Error Handling**: Clear error messages and validation feedback
- **Empty States**: Helpful guidance when no data exists

## 📊 Plan Gating Logic

Free plan users can:
- ✅ Create 1 restaurant
- ✅ Add up to 20 menu items
- ✅ Generate QR codes
- ✅ See platform branding on their menu

Pro plan users can:
- ✅ Unlimited menu items
- ✅ Remove platform branding
- ✅ Customize theme color
- (Future: multiple restaurants, staff accounts)

## 🚀 Future Enhancements

The architecture supports easy expansion to:
- **Online Ordering**: Accept orders directly from menu
- **Payment Integration**: Stripe, PayPal, local payment gateways
- **Analytics**: Track QR scans, customer browsing patterns
- **Multi-Branch Support**: Manage multiple locations from one dashboard
- **Staff Accounts**: Role-based access control for restaurant staff
- **Email Notifications**: Order alerts, reservation reminders
- **Loyalty Programs**: Points and discounts for repeat customers

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.9.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first styling |
| Drizzle ORM | 0.45.x | Lightweight SQL toolkit |
| Jose | 6.x | JWT library |
| Bcryptjs | 3.x | Password hashing |
| QRCode | 1.5.x | QR code generation |
| Lucide React | 1.8.x | Icon library |
| Zod | 4.x | Schema validation |

## 📝 Scripts

```bash
bun dev              # Start development server
bun build            # Build production bundle
bun start            # Start production server
bun lint             # Run ESLint
bun typecheck        # Run TypeScript checks
bun db:generate      # Generate database migrations
bun db:migrate       # Run database migrations
```

## 🤝 Contributing

This is a starting template for AI-assisted development. Feel free to extend and customize as needed.

## 📄 License

MIT

## 📧 Support

For deployment questions, refer to `SETUP.md` for Supabase + Vercel instructions.

---

**Built with ❤️ for restaurant owners everywhere.**
