# Comprehensive Test Plan
## NutriTrack — Smart Calorie & Nutrition Tracker

**Document Version:** 1.0.0  
**Frameworks:** Vitest, React Testing Library, Supertest, MongoDB Memory Server  

---

## 1. Test Objectives & Strategy
The testing suite verifies mathematical precision, secure multi-tenant data isolation, schema validation enforcement, reliable diary CRUD workflows, and frontend state synchronization.

---

## 2. Test Suites & Test Cases

### 2.1 Nutrition Calculation Unit Tests (`nutrition.test.ts`)
* **TC-CALC-01**: Mifflin-St Jeor REE calculation for male (e.g. 70kg, 175cm, 25y = 1683.75 kcal).
* **TC-CALC-02**: Mifflin-St Jeor REE calculation for female (e.g. 60kg, 165cm, 25y = 1375.25 kcal).
* **TC-CALC-03**: Activity multiplier evaluation across all 5 levels (1.2 to 1.9).
* **TC-CALC-04**: Quantity scaling from reference 100g to 50g, 150g, and 200g (verifying exact arithmetic and round1dp precision).
* **TC-CALC-05**: Serving piece scaling (e.g., 2 eggs where 1 egg reference = 72 kcal).
* **TC-CALC-06**: Safe handling of zero or negative quantities (graceful error / clamp).

### 2.2 Authentication & Security API Tests (`auth.test.ts`)
* **TC-AUTH-01**: User registration with valid credentials succeeds and sets HttpOnly cookie.
* **TC-AUTH-02**: Registration rejects duplicate normalized email with 409 Conflict.
* **TC-AUTH-03**: Password below 8 characters rejected by Zod validation (400 Bad Request).
* **TC-AUTH-04**: Login with correct credentials returns user payload and valid session cookie.
* **TC-AUTH-05**: Login with invalid password returns 401 Unauthorized.
* **TC-AUTH-06**: Logout clears cookie with expired maxAge.
* **TC-AUTH-07**: Protected endpoint without cookie returns 401 Unauthorized.

### 2.3 Food Database & Diary Integration Tests (`diary.test.ts`)
* **TC-DIAR-01**: Food search returns matching items case-insensitively.
* **TC-DIAR-02**: User logs a food item; server calculates and stores correct nutrient snapshot.
* **TC-DIAR-03**: Updating food log quantity updates calories and macros in response.
* **TC-DIAR-04**: Deleting food log removes item and recalculates meal and day subtotals.
* **TC-DIAR-05**: User A cannot view, edit, or delete User B's food log entries (403/404 isolation).
* **TC-DIAR-06**: Historical snapshot retains original values even if food master changes.

### 2.4 User Profile & Target Tests (`profile.test.ts`)
* **TC-PROF-01**: Updating physical attributes automatically recomputes and stores TDEE target.
* **TC-PROF-02**: Manual calorie override preserves custom target without recalculation overwrite.
* **TC-PROF-03**: Account deletion cascades to all associated food logs and weight records.

---

## 3. Test Execution Command Matrix
* Backend Unit & API Tests: `npm run test --workspace=server`
* Frontend Unit Tests: `npm run test --workspace=client`
* Monorepo Full Test: `npm test`
