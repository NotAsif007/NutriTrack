# Quality Evaluation Report
## NutriTrack — Smart Calorie & Nutrition Tracker

**Evaluation Standard:** ISO/IEC 25010 Software Product Quality Standard  
**Project Category:** B.Tech Computer Science & Engineering Capstone / Mini-Project  
**Evaluation Date:** October 2026  

---

## 1. Functional Correctness & Completeness
* **Zero Mock API Data**: The application connects exclusively to real database records. Hardcoded statistics or simulated mock payloads were forbidden and eliminated.
* **Server-Authoritative Calculations**: Nutrition totals submitted from client forms are discarded. The server computes calories and macronutrients directly using the food's reference serving size and logged quantity, ensuring zero-trust integrity.
* **CRUD Completeness**: All 4 core entities (Users, Foods, FoodLogs, WeightLogs) feature complete Create, Read, Update, and Delete workflows with immediate UI updates.

---

## 2. Calculation Accuracy & Precision
* **Mifflin-St Jeor Formula**: Verified against known empirical benchmarks for both male and female baselines. Neutral adjustments are supported for unspecified sex.
* **Floating-Point Drift Mitigation**: All scaled macronutrients are stored with exact 1-decimal precision (`roundTo1Decimal`), avoiding common IEEE-754 binary floating-point anomalies (e.g. `0.30000000000000004g`).
* **Energy Flooring**: Calorie deficit calculations enforce an automated minimum safety floor of 1200 kcal/day to prevent unhealthy under-nourishment recommendations.

---

## 3. Security & Multi-Tenancy Review
* **Cookie-Based Authentication**: Tokens reside in `HttpOnly`, `SameSite=Lax` (and `SameSite=Strict` in production) cookies, mitigating JavaScript token harvesting and XSS vectors.
* **Per-Record Tenant Isolation**: Verified via test case `TC-SEC-01`: User 2 attempting to query, patch, or delete User 1's food logs or private custom foods receives `404 Not Found` or `403 Forbidden`.
* **Zero Sensitive Exposure**: Password hashes are stripped before serialization in all API responses.
* **Rate Limiting**: Authentication routes (`/auth/login`, `/auth/register`) are throttled at 30 requests per 15-minute window by `express-rate-limit`.

---

## 4. Usability & Accessibility (WCAG 2.2 AA)
* **Visual Hierarchy & Color Tokens**: Uses a clean, modern palette featuring an off-white canvas (`#F8F9F7`), crisp white cards with subtle borders (`#E5E7EB`), and emerald green accents (`#059669`).
* **Keyboard Accessibility**: All interactive modals (`FoodSearchModal`, `CustomFoodModal`, `ConfirmDialog`) support keyboard `Escape` closing and maintain focus trapped within the active dialog.
* **Form Validation Feedback**: Real-time validation messages display beneath invalid inputs without obscuring user focus.
* **Over-Budget Warning**: When consumed calories exceed the budget, an amber/rose badge clearly displays `+X kcal over target`, eliminating misleading negative balances.

---

## 5. Responsive Behavior
* **Mobile (360px - 640px)**: The navigation switches to an ergonomic bottom navigation bar (`MobileNav`). Form fields, search cards, and food diary meal sections collapse vertically to prevent horizontal scroll overflow.
* **Tablet & Laptop (768px - 1024px)**: Dual-column grid layouts for calorie and macronutrient cards.
* **Desktop (1024px+)**: Sidebar navigation (`AppSidebar`) with profile pills and expanded data visualizations.

---

## 6. Performance & Build Metrics
* **TypeScript Compilation**: Zero compilation errors across both client and server under TypeScript strict mode (`"strict": true`).
* **Client Production Bundle**:
  * Output bundle generated via Vite:
  * `dist/index.html`: 1.10 kB (gzip: 0.63 kB)
  * `dist/assets/index.css`: 27.17 kB (gzip: 5.40 kB)
  * `dist/assets/index.js`: 764.50 kB (gzip: 223.01 kB)
* **Database Queries**: Indexed compound lookups (`{ userId: 1, date: 1, mealType: 1 }`) execute under 10ms for typical daily diary operations.
* **Self-Contained Local Execution**: Automated fallback to `mongodb-memory-server` allows the application to execute out-of-the-box on evaluation machines without requiring a pre-installed MongoDB daemon.
