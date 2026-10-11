# Comprehensive Test Report
## NutriTrack — Smart Calorie & Nutrition Tracker

**Report Date:** October 11, 2026  
**Execution Environment:** Node.js v24.8.0, Windows 11, Vitest v3.2.7, Supertest, MongoDB Memory Server  
**Test Status:** 100% PASSED (40/40 tests passing)  

---

## 1. Summary of Test Execution

| Test Suite | Scope | Target File | Tests Run | Passed | Failed | Duration |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Nutrition Calculation Engine** | Unit Tests | `server/src/tests/nutritionCalculator.test.ts` | 14 | 14 | 0 | 8ms |
| **Backend REST API Integration** | API & Security | `server/src/tests/api.test.ts` | 21 | 21 | 0 | 4.67s |
| **Frontend UI Components** | Component Unit | `client/src/test/components.test.tsx` | 5 | 5 | 0 | 90ms |
| **Total** | **Full Stack** | | **40** | **40** | **0** | **10.8s** |

---

## 2. Detailed Test Results by Test Case

### 2.1 Nutrition Calculation Unit Tests (`nutritionCalculator.test.ts`)
* `roundTo1Decimal`:
  * Rounding `12.34` -> `12.3` (PASSED)
  * Rounding `12.36` -> `12.4` (PASSED)
  * Rounding `12.05` -> `12.1` (PASSED)
  * Rounding `0` -> `0` (PASSED)
* `calculateREE` (Mifflin-St Jeor):
  * Male (70kg, 175cm, 25y) = $10(70) + 6.25(175) - 5(25) + 5 = 1674 \text{ kcal}$ (PASSED)
  * Female (60kg, 165cm, 25y) = $10(60) + 6.25(165) - 5(25) - 161 = 1345 \text{ kcal}$ (PASSED)
  * Neutral / Unspecified = Midpoint factor $-78 = 1535 \text{ kcal}$ (PASSED)
  * Throws validation error for negative metrics (PASSED)
* `calculateNutritionTargets` (TDEE & Goals):
  * Sedentary male maintenance: REE 1674 * 1.2 = 2009 kcal (PASSED)
  * Moderately active male weight loss: TDEE - 500 kcal deficit (PASSED)
  * Extreme low metric safety floor: enforces minimum 1200 kcal floor (PASSED)
  * Lightly active male weight gain: TDEE + 350 kcal surplus (PASSED)
* `scaleNutrition` (Serving Scaling):
  * Reference 100g white rice (130 kcal, 2.7g P, 28.2g C, 0.3g F):
    * Scaled to 100g (1x) = 130 kcal, 2.7g P, 28.2g C, 0.3g F (PASSED)
    * Scaled to 50g (0.5x) = 65 kcal, 1.4g P, 14.1g C, 0.2g F (PASSED)
    * Scaled to 150g (1.5x) = 195 kcal, 4.1g P, 42.3g C, 0.5g F (PASSED)
    * Scaled to 200g (2x) = 260 kcal, 5.4g P, 56.4g C, 0.6g F (PASSED)
    * Throws error for zero or negative quantity (PASSED)

### 2.2 Backend REST API Integration Tests (`api.test.ts`)
* **Health Check**:
  * `GET /api/v1/health` returns status `healthy` with timestamp (PASSED)
* **Authentication Flow**:
  * `POST /auth/register` creates account, hashes password, omits hash in response (PASSED)
  * `POST /auth/register` rejects duplicate email with 409 Conflict (PASSED)
  * `POST /auth/register` rejects password $< 8$ chars with 400 Bad Request (PASSED)
  * Registers User 2 for multi-tenant isolation testing (PASSED)
  * `POST /auth/login` issues valid JWT session cookie on correct credentials (PASSED)
  * `POST /auth/login` rejects wrong password with 401 Unauthorized (PASSED)
  * `GET /auth/me` returns authenticated user profile (PASSED)
  * `GET /auth/me` rejects unauthenticated requests with 401 (PASSED)
* **Profile & Mifflin-St Jeor TDEE**:
  * `PATCH /profile` updates metrics and recomputes targets automatically (PASSED)
  * `PATCH /profile` accepts manual calorie target override without overwrite (PASSED)
* **Food Database**:
  * `GET /foods?q=rice` returns matching standard foods (PASSED)
  * `POST /foods/custom` creates custom food item for User 1 (PASSED)
* **Food Diary & Server Calculation**:
  * `POST /food-logs` logs 150g rice, server calculates scaled 195 kcal (PASSED)
  * `GET /food-logs?date=2026-10-11` returns diary entries with meal subtotals (PASSED)
  * `PATCH /food-logs/:id` updates quantity to 200g, recalculates to 260 kcal (PASSED)
  * `GET /nutrition/daily` reflects updated consumed and remaining calories (PASSED)
* **Multi-Tenant Isolation**:
  * User 2 cannot edit User 1's food log entry (returns 404) (PASSED)
  * User 2 cannot delete User 1's food log entry (returns 404) (PASSED)
  * User 2's daily diary shows 0 calories for the same date (PASSED)
* **Deletion & Recalculation**:
  * `DELETE /food-logs/:id` removes entry and resets daily total to 0 (PASSED)

### 2.3 Frontend Component Unit Tests (`components.test.tsx`)
* `Button`: Renders text, respects disabled and loading states (PASSED)
* `CalorieSummaryCard`: Renders target, consumed, and remaining budget (PASSED)
* `CalorieSummaryCard`: Renders over-budget badge when intake exceeds target (PASSED)
* `MacroProgressCard`: Renders protein, carbs, fat, and fiber meters (PASSED)
* `EmptyState`: Renders empty title, description, and action button (PASSED)

---

## 3. Defects Discovered and Corrective Actions Applied

| Defect ID | Severity | Root Cause | Fix Applied | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | High | Vitest default `hookTimeout` (30s) timed out on first run while downloading MongoDB in-memory binary. | Increased `hookTimeout` in `vitest.config.ts` and `api.test.ts` to 180s. Binary cached permanently. | Suite completed in 6.97s on subsequent runs. |
| **DEF-02** | Medium | JSX parsed `$10 \times \text{kg}$` in `ProfilePage.tsx` as JavaScript expression identifiers. | Replaced with mathematical prose `10 × weight_kg + 6.25 × height_cm...`. | Production build succeeded with zero TS errors. |
| **DEF-03** | Low | Unused imports flagged under strict TypeScript mode (`AppLayout`, `FoodDatabasePage`, `FoodDiaryPage`). | Cleaned up all unused imports and added `dietaryPreference` select control. | `tsc --noEmit` passed with 0 errors. |
