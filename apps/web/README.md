# SELLORA Web Application (`@sellora/web`)

SELLORA is a premium technology ecommerce application for Bangladesh built on **Next.js 14**, **React 18**, **Tailwind CSS**, and **Framer Motion**.

---

## 📁 Directory Structure & Architecture

```text
apps/web/src/
├── app/                      # Next.js App Router pages
│   ├── (admin)/              # Merchant & Admin Dashboard routes
│   ├── (auth)/               # User login/register routes
│   ├── (dashboard)/          # User profile & order history routes
│   └── (shop)/               # Primary Storefront routes
│       ├── page.tsx          # Storefront Homepage
│       ├── products/[id]/    # Product Details Page
│       ├── categories/       # Category discovery
│       ├── checkout/         # Multi-step checkout engine
│       └── cart/             # Shopping cart
├── components/               # Shared & Layout components
│   ├── common/               # Core UI components (SelloraProductCard)
│   ├── home/                 # Storefront Homepage components & index.ts
│   └── layout/               # Navbars, Headers, Footers & index.ts
├── features/                 # Feature-sliced components & logic
│   └── products/
│       └── components/
│           └── detail/       # Product Details Page components & index.ts
├── lib/                      # Utilities, API client & Mock Data Engine
│   └── products-data.ts      # Enriched tech product schema & mock datasets
└── providers/                # React Query & Application Context providers
```

---

## 🚀 Available Scripts

In `apps/web`, you can run the following scripts:

- `npm run dev`: Starts the Next.js development server at `http://localhost:3000`.
- `npm run build`: Compiles production Next.js build.
- `npm run typecheck`: Validates TypeScript strict type checking without emitting JS.
- `npm run lint`: Runs ESLint core web vitals checks.

---

## 🎨 Design System & Conventions

1. **Brand Colors**:
   - Primary Accent: `#DE1162` (Pink Red)
   - Secondary Hover Accent: `#C20E54`
   - Dark Navy Background Accent: `#1E293B` / `#0F172A`
   - Page Background: `#FAFAFA`

2. **Clean Import Barrel Exports**:
   - Layout components: `import { StorefrontHeader, MobileBottomBar, StorefrontFooter } from '@/components/layout';`
   - Homepage components: `import { StorefrontHero, CategoryBentoGrid, FlashSaleCarousel } from '@/components/home';`
   - Detail components: `import { ProductGallery, ProductPricingCard } from '@/features/products/components/detail';`

3. **Motion Design**:
   - Animations use `framer-motion` for spring transitions, hover elevation, and layout animations (`AnimatePresence`, `motion.div`).
