# SELLORA - Enterprise Multivendor E-Commerce Platform

SELLORA is a production-grade, enterprise multi-vendor e-commerce platform. The project is architecture-decoupled into completely independent **Frontend** and **Backend** applications.

---

## Project Structure

```text
SELLORA/
├── frontend/             # Standalone Next.js 14 Storefront & Admin Portal
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.example
│   ├── .env.local
│   └── src/
│       ├── app/          # Next.js App Router (shop, customer, vendor, admin)
│       ├── components/   # UI & Layout components
│       ├── features/     # Feature-specific components
│       ├── hooks/        # React custom hooks
│       ├── lib/          # Centralized API client & utility functions
│       ├── providers/    # Context providers (Auth, App state)
│       └── types/        # Domain entity TypeScript interfaces
│
├── backend/              # Standalone Express.js REST API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── config/       # Environment, Database, CORS, Helmet, Logger config
│       ├── controllers/  # HTTP Request Handlers
│       ├── routes/       # Express Route Declarations
│       ├── services/     # Business Logic Layer
│       ├── models/       # Database Pool, DDL Schema & Repositories
│       ├── middleware/   # Auth, Tracing, Error Handling, Request Logging
│       ├── types/        # Domain Enums & API Types
│       ├── validators/   # Request Validation Schemas (Zod)
│       ├── utils/        # AppError, ApiResponse, Logger, JWT helpers
│       ├── scripts/      # Database Seeder & SuperAdmin creation
│       ├── app.ts        # Express Application Setup
│       └── server.ts     # HTTP Server Bootstrap
│
└── README.md
```

---

## Architecture Highlights

- **Decoupled Applications**: `frontend` and `backend` are 100% independent. Each maintains its own `package.json`, dependencies, build scripts, and configuration.
- **Hosting Flexibility**: `frontend` can be deployed independently to Vercel/Netlify while `backend` can be deployed to Render/AWS/Railway/Heroku.
- **Relational MySQL Engine**: High-performance parameterized SQL queries, connection pooling, and atomic transaction execution for inventory checkouts.
- **Observability & Security**: Request tracing (`X-Trace-ID`), structured log rotators (Winston), HTTP header security (Helmet), CORS controls, and Zod input validation.

---

## Getting Started

### 1. Backend API Setup (`backend/`)

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database seeder (seeds tables, initial products, and Super Admin user)
npm run db:seed

# Start development server
npm run dev
# Server running at http://localhost:5000/api/v1
```

### 2. Frontend Web Setup (`frontend/`)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
# App running at http://localhost:3000
```

---

## Production Build & Type Checking

From workspace root:

```bash
# Type check both applications
npm run typecheck

# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

---

## Default Credentials (Dev Seeder)

- **Super Admin**: `admin@sellora.com` / `Admin123456`
- **Vendor Seller**: `remax@sellora.com` / `Vendor123456`

---

## License

Private & Proprietary - SELLORA Platform.
