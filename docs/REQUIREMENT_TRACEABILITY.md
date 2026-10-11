# Requirements Traceability Matrix (RTM)
## NutriTrack — Smart Calorie & Nutrition Tracker

| Req ID | Requirement Statement | Design Component | Implementation File(s) | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | User Registration | Auth Module | `server/src/controllers/auth.controller.ts`, `client/src/pages/RegisterPage.tsx` | `TC-AUTH-01` | Planned |
| **FR-002** | Email Normalization | Auth Service | `server/src/services/auth.service.ts` | `TC-AUTH-02` | Planned |
| **FR-003** | Bcrypt Hashing | Auth Security | `server/src/services/auth.service.ts` | `TC-AUTH-01` | Planned |
| **FR-004** | HttpOnly Cookie JWT | Auth Middleware | `server/src/middleware/auth.middleware.ts` | `TC-AUTH-04` | Planned |
| **FR-005** | Session Invalidation | Auth Controller | `server/src/controllers/auth.controller.ts` | `TC-AUTH-06` | Planned |
| **FR-006** | Protected Routes | Route Guard | `client/src/components/ProtectedRoute.tsx` | `TC-AUTH-07` | Planned |
| **FR-007** | Profile Management | Profile Module | `server/src/controllers/profile.controller.ts`, `client/src/pages/ProfilePage.tsx`| `TC-PROF-01` | Planned |
| **FR-008** | Mifflin-St Jeor TDEE | Calc Engine | `server/src/utils/nutritionCalculator.ts` | `TC-CALC-01` | Planned |
| **FR-009** | Target Override | Profile Module | `server/src/controllers/profile.controller.ts` | `TC-PROF-02` | Planned |
| **FR-011** | Standard Food Library| Food Catalog | `server/src/scripts/seedFoods.ts`, `server/src/models/Food.ts` | `TC-FOOD-01` | Planned |
| **FR-012** | Food Search & Filter | Food Controller | `server/src/controllers/food.controller.ts`, `client/src/pages/FoodDatabasePage.tsx` | `TC-DIAR-01` | Planned |
| **FR-013** | Custom Food Creation | Food Module | `server/src/controllers/food.controller.ts` | `TC-FOOD-02` | Planned |
| **FR-015** | Meal Categories | Diary Module | `server/src/models/FoodLog.ts`, `client/src/pages/FoodDiaryPage.tsx` | `TC-DIAR-02` | Planned |
| **FR-016** | Date-based Diary | Diary Module | `client/src/components/DateNavigator.tsx` | `TC-DIAR-02` | Planned |
| **FR-017** | Server-Side Scaling | Nutrition Engine | `server/src/utils/nutritionCalculator.ts` | `TC-CALC-04` | Planned |
| **FR-018** | Log Immutability | Diary Service | `server/src/services/diary.service.ts` | `TC-DIAR-06` | Planned |
| **FR-019** | Food Log CRUD | Diary Controller | `server/src/controllers/diary.controller.ts` | `TC-DIAR-03` | Planned |
| **FR-020** | Daily Calorie Summary| Dashboard Module| `server/src/controllers/nutrition.controller.ts`, `client/src/pages/DashboardPage.tsx`| `TC-DASH-01` | Planned |
| **FR-021** | Macro Breakdown | Dashboard Module| `client/src/components/MacroProgressCard.tsx` | `TC-DASH-01` | Planned |
| **FR-022** | 7-Day History Chart | Progress Module | `server/src/controllers/nutrition.controller.ts`, `client/src/pages/ProgressPage.tsx` | `TC-HIST-01` | Planned |
| **FR-024** | Weight Tracking | Weight Module | `server/src/controllers/weight.controller.ts`, `client/src/components/WeightTracker.tsx` | `TC-WGHT-01` | Planned |
| **NFR-001**| Cross-Tenant Security | Security MW | `server/src/middleware/auth.middleware.ts` | `TC-SEC-01` | Planned |
