# NutriTrack — Smart Calorie & Nutrition Tracker

> **A Complete Full-Stack Web Application Demonstrating the Software Development Life Cycle (SDLC)**  
> *Engineered for B.Tech Computer Science & Engineering Capstone / Mini-Project Evaluation.*

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Express REST](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Tests-42%2F42%20Passing-brightgreen?logo=vitest)](https://vitest.dev/)
[![Security](https://img.shields.io/badge/Auth-HttpOnly%20JWT%20Cookies-orange)](https://jwt.io/)

---

## 1. Project Overview

**NutriTrack** is a functional nutrition tracking web application designed to help individuals monitor daily caloric intake, track macronutrients (protein, carbohydrates, fat, dietary fiber), maintain date-driven food diaries, calculate resting metabolic requirements using the **Mifflin-St Jeor equation**, and review historical nutrition trends.

### Key Differentiators & Engineering Highlights
* **Zero Simulated Data**: Every statistic, chart, subtotal, and budget calculation is derived from real database records.
* **Zero-Trust Server Calculations**: Client forms provide food IDs and serving quantities; the server computes, scales, and snapshots nutritional values directly into the database to ensure mathematical integrity.
* **Modern Fitness UI Kit Redesign**: Inspired by iOS Health and Nutrio UI kits featuring clean card hierarchy, circular gauge hero displays, planned meal cards with dish thumbnails, and interactive 7-day week calendar strips.
* **Elevated Quick Log Action Sheet**: A prominent floating center button triggers a frosted quick-log modal allowing instant 1-tap logging for Breakfast, Lunch, Dinner, Snacks, +250ml Water, and Body Weight.
* **Dynamic Color Theme Engine**: Full-system color customization supporting 6 curated palettes (**Emerald Mint**, **Royal Indigo**, **Nutrio Lime**, **Ocean Cyan**, **Sunset Coral**, **Rose Berry**) driven by CSS variables and Tailwind tokens with zero stale components.
* **Cross-Device Responsive Architecture**: Custom-tailored layouts for smartphones (floating bottom pill navigation, touch targets), tablets (compact 72px icon-rail sidebar, balanced 2-column grid), and desktop PCs (260px expanded sidebar, full analytics dashboard).
* **Daily Hydration Tracker**: Per-date water intake logger with instant portion increment buttons (250ml, 500ml, 750ml) and goal celebrations.
* **1-Click Nutrition Exporter**: Generate formatted plain-text/markdown diary reports for fitness coaches and download structured JSON logs.
* **Historical Immutability**: Modifying or removing standard foods from the catalog does not distort past diary logs.
* **Zero-Config Local Execution**: Automated fallback to `mongodb-memory-server` allows the entire application to boot and pass all 42 tests out-of-the-box on evaluation machines without requiring a pre-installed MongoDB daemon.
* **Strict Multi-Tenant Isolation**: Verified through automated security tests where users cannot access, modify, or delete records belonging to other accounts.

---

## 2. Technology Stack

### Frontend (`client/`)
* **Framework**: React 18, Vite, TypeScript (`strict: true`)
* **Styling & UI**: Tailwind CSS, Lucide React Icons
* **Routing**: React Router v7
* **Data Fetching & Cache**: TanStack Query (React Query)
* **Form Management**: React Hook Form with Zod schema resolvers
* **HTTP Client**: Axios with `withCredentials: true` (HttpOnly cookie session support)
* **Visualizations**: Recharts (7-day rolling intake bars, body weight trend curve)
* **Testing**: Vitest with React Testing Library and JSDOM

### Backend (`server/`)
* **Runtime**: Node.js v24+, Express.js, TypeScript
* **Database & ODM**: MongoDB with Mongoose ODM
* **Security & Auth**: JWT authentication in `HttpOnly` cookies, `bcryptjs` password hashing, Helmet, CORS origin restriction, Express rate limiting
* **Validation**: Zod schema validation middleware for all request bodies, query params, and route parameters
* **API Documentation**: Interactive Swagger / OpenAPI UI at `/api/docs`
* **Testing**: Vitest, Supertest, MongoDB Memory Server

---

## 3. System Architecture

```
                       +---------------------------------------+
                       |   Client (React + Vite SPA)           |
                       |   - Dashboard, Food Diary, Catalog    |
                       |   - Progress Charts, Profile & Goals  |
                       +-------------------+-------------------+
                                           |
                                  HTTPS / REST (JSON)
                                 HttpOnly JWT Cookie
                                           |
                                           v
                       +---------------------------------------+
                       |   Server (Express + TypeScript API)   |
                       |   - Helmet, CORS, Rate Limiters       |
                       |   - Zod Request Validation Middleware |
                       |   - Mifflin-St Jeor Calculation Engine|
                       |   - Nutrition Serving Scaling Engine  |
                       +-------------------+-------------------+
                                           |
                                      Mongoose ODM
                                           |
                                           v
                       +---------------------------------------+
                       |   MongoDB Database                    |
                       |   - users (Profiles & TDEE Targets)   |
                       |   - foods (Standard & Custom Library) |
                       |   - food_logs (Immutable Snapshots)   |
                       |   - weight_logs (Chronological Body Wt)|
                       +---------------------------------------+
```

---

## 4. SDLC Documentations

Complete lifecycle documentation is available in the [`docs/`](./docs) folder:

| Document | Purpose |
| :--- | :--- |
| [**SRS.md**](./docs/SRS.md) | Software Requirements Specification (Functional & Non-Functional Requirements, User Stories, Acceptance Criteria). |
| [**SYSTEM_DESIGN.md**](./docs/SYSTEM_DESIGN.md) | System architecture, component responsibilities, data flow, authentication sequences, and error strategies. |
| [**DATABASE_DESIGN.md**](./docs/DATABASE_DESIGN.md) | Mongoose collection schemas, ER diagrams, compound index strategies, and historical snapshot models. |
| [**API_DOCUMENTATION.md**](./docs/API_DOCUMENTATION.md) | REST API endpoints, request/response JSON payloads, status codes, and error envelopes. |
| [**TEST_PLAN.md**](./docs/TEST_PLAN.md) | Testing scope, unit calculation cases, Supertest API scenarios, and multi-tenant security verification. |
| [**TEST_REPORT.md**](./docs/TEST_REPORT.md) | Actual test execution report with 42/42 passing tests, defect diagnosis, and durations. |
| [**QUALITY_EVALUATION.md**](./docs/QUALITY_EVALUATION.md) | ISO/IEC 25010 quality assessment across correctness, security, performance, and accessibility. |
| [**SECURITY_NOTES.md**](./docs/SECURITY_NOTES.md) | Deep dive into HttpOnly cookies, password hashing, NoSQL injection defenses, and tenant isolation. |
| [**USER_MANUAL.md**](./docs/USER_MANUAL.md) | Comprehensive illustrated end-user guide covering registration, food logging, serving calculations, and weight tracking. |
| [**REFLECTION.md**](./docs/REFLECTION.md) | Authentic reflective learning notes on SDLC execution, defects diagnosed, and architectural pivots. |
| [**REQUIREMENT_TRACEABILITY.md**](./docs/REQUIREMENT_TRACEABILITY.md) | Traceability matrix mapping every requirement (FR-001 to FR-024) to its implementation file and test case. |

---

## 5. Local Setup & Installation Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher (v24 recommended)
* **npm**: v9.0.0 or higher
* *(Optional)*: Local MongoDB instance or MongoDB Atlas URI (if absent, NutriTrack seamlessly boots an embedded in-memory database automatically).

### Step 1: Install Dependencies
From the repository root:
```bash
# Installs backend dependencies
npm install --workspace=server

# Installs frontend dependencies
npm install --workspace=client
```

### Step 2: Environment Variables Setup
Copy the example environment files:
```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

*(The defaults in `.env` are pre-configured for instant local development without modifications).*

### Step 3: Run the Development Server
You can launch both the backend and frontend concurrently:
```bash
npm run dev
```

Or run them in separate terminals:
```bash
# Terminal 1: Launch Backend REST API (Port 5000)
npm run dev:server

# Terminal 2: Launch Frontend Application (Port 5173)
npm run dev:client
```

Open your browser at **`http://localhost:5173`**.

---

## 6. Running Automated Tests

NutriTrack includes a test suite covering unit calculations, server-side scaling, authentication security, multi-tenant isolation, and frontend UI components.

```bash
# Run all backend tests (35 tests)
npm run test:server

# Run all frontend component tests (7 tests)
npm run test:client
```

### Verified Test Summary
```text
✓ server/src/tests/nutritionCalculator.test.ts (14 tests) [8ms]
✓ server/src/tests/api.test.ts (21 tests) [4.36s]
✓ client/src/test/components.test.tsx (7 tests) [100ms]

Total: 42 tests passed (100% success rate)
```

---

## 7. Interactive API Documentation

When the backend is running, visit:
👉 **`http://localhost:5000/api/docs`**

The interactive Swagger UI allows you to inspect and test all endpoints (`/auth`, `/profile`, `/foods`, `/food-logs`, `/nutrition`, `/weight-logs`).

---

## 8. Seeding the Food Database

NutriTrack includes an idempotent seed script containing verified nutritional data from the **Indian Food Composition Tables (IFCT)** and **USDA FoodData Central**:
```bash
npm run seed
```

This populates staple foods including:
* Cooked White Rice, Brown Rice, Whole Wheat Roti, Rolled Oats, Whole Wheat Bread
* Cooked Yellow Dal, Boiled Chickpeas, Cooked Kidney Beans (Rajma)
* Whole Boiled Eggs, Egg Whites, Paneer, Cow Milk, Plain Curd (Dahi)
* Grilled Chicken Breast, Cooked Salmon
* Bananas, Apples, Oranges, Boiled Potatoes, Steamed Broccoli, Spinach, Cucumbers
* Raw Almonds, Peanut Butter, Green Tea, Chai, Black Coffee.

---

## 9. Production Build & Deployment

### Production Build
```bash
# Builds server TypeScript to dist/ and client assets to client/dist/
npm run build
```

### Deployment Configuration
* **Frontend**: Deploy `client/` to **Vercel** or **Netlify**. Set `VITE_API_BASE_URL` to your production backend URL.
* **Backend**: Deploy `server/` to **Render**, **Railway**, or **AWS ECS**. Set `NODE_ENV=production`, `MONGODB_URI` to your MongoDB Atlas connection string, `JWT_SECRET`, and `CLIENT_ORIGIN`.
* **Database**: Hosted on **MongoDB Atlas** with IP whitelisting.

---

## 10. License & Academic Attribution
Developed as an academic demonstration of the Software Development Life Cycle (SDLC). 
Distributed under the MIT License.
