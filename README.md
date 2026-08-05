# SELLORA - Enterprise Multivendor E-Commerce Platform

SELLORA is a production-grade, enterprise multi-vendor e-commerce platform built using Next.js (App Router), Node.js/Express, and MongoDB Native Driver.

---

## Technical Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom HSL design tokens (`brand-lightest`, `brand-light`, `brand-primary`, `brand-dark`)
- **State & Data Fetching**: React Context, TanStack Query

### Backend (`apps/api`)
- **Server**: Node.js & Express.js
- **Database**: MongoDB Native Driver (`MongoClient` connection pooling)
- **Authentication**: JWT Bearer Auth & Bcrypt password hashing
- **Validation**: Zod & `@sellora/shared-validators`

### Workspace Packages
- `@sellora/shared-types`: Shared domain entity models
- `@sellora/shared-validators`: Shared Zod validation schemas

---

## Features

- 🛒 **Customer Storefront & Checkout**: High-performance UI with real-time order placement and payment method support (Cash on Delivery, bKash, Nagad, SSLCommerz).
- 👤 **Customer Dashboard**: Profile details, address management, and live order tracking history.
- 🏪 **Business Owner / Vendor Dashboard (`/seller`)**: Sales earnings overview, product catalog CRUD (Add/Edit/Delete), and order fulfillment status updates (`PENDING` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`).
- 🛡️ **Super Admin Control Center (`/admin`)**: Platform GMV sales analytics, vendor store approvals/moderation, and site-wide announcement configuration.

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance or MongoDB Atlas Connection String

### Installation

```bash
# Clone the repository
git clone https://github.com/shakirhasan133/Sellora.git
cd Sellora

# Install dependencies
npm install

# Build shared workspace packages
npm run build:shared

# Build backend API & frontend
npm run build:api
npm run build:web
```

### Seeding Initial Data

```bash
npm run db:seed
```

### Development Mode

```bash
# Run backend API
npm run dev:api

# Run Next.js web application
npm run dev:web
```

---

## License

Private & Proprietary - SELLORA Platform.
