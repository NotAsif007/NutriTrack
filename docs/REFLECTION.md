# Engineering Reflection & Learning Notes
## NutriTrack — Smart Calorie & Nutrition Tracker

**Author:** Full-Stack Engineering Team  
**Context:** B.Tech Computer Science & Engineering SDLC Project  
**Date:** October 2026  

---

## 1. What Was Learned

1. **Decoupled Architecture with Monorepo Workspaces**:
   Organizing the application into npm workspaces (`server` and `client`) provided unified dependency orchestration while strictly segregating backend business rules from the frontend presentation layer.
2. **Zero-Trust Client Calculations**:
   In initial design discussions, there was a temptation to let the frontend calculate nutrients and send the final values to the server. However, recognizing that client payloads can be manipulated or experience floating-point divergence led us to mandate server-authoritative calculations. The client only renders a transient preview, while the server looks up the reference food and computes persisted nutrients.
3. **Historical Log Immutability**:
   Early drafts considered referencing food items via `foodId` in `FoodLog`. If a food's nutritional composition was updated or deleted later, historical diary records would have been altered retroactively. Adopting an **immutable snapshot pattern**—where `foodNameSnapshot` and calculated nutrient values are stored permanently within the log document—ensured historical auditability.

---

## 2. Key Technical Challenges & Defect Diagnosis

### 2.1 The In-Memory Database Timeout Issue (DEF-01)
* **Challenge**: When running automated backend API tests on an isolated machine without a running MongoDB daemon, the test runner timed out after 30 seconds.
* **Diagnosis**: Inspecting the test logs revealed that `mongodb-memory-server` was downloading the required MongoDB binary (~600 MB) for Windows on its initial launch. Vitest's default `hookTimeout` was 30,000 ms, causing the test suite to abort midway through the download.
* **Solution**: We increased `hookTimeout` in `vitest.config.ts` and the test file's `beforeAll` hook to 180,000 ms (3 minutes). Once downloaded, the binary was permanently cached in the system cache, and subsequent test runs executed in under 7 seconds.

### 2.2 JSX Expression Parsing with Mathematical Notations (DEF-02)
* **Challenge**: The frontend production build (`tsc && vite build`) failed with errors: `Cannot find name 'kg'`, `Cannot find name 'cm'`.
* **Diagnosis**: In `ProfilePage.tsx`, the formula string was written with LaTeX notation `($10 \times \text{kg} + ...$)`. React JSX treats curly braces `{...}` inside markup as inline JavaScript expressions, attempting to evaluate `kg` and `cm` as variables.
* **Solution**: Converted the formula text into HTML entities and clean prose: `10 × weight_kg + 6.25 × height_cm - 5 × age + gender offset`, resolving the issue.

### 2.3 Windows Plugin Pre-Tool Hook Path Handling
* **Challenge**: In the initial project initialization, a pre-tool telemetry hook failed because an absolute path was concatenated onto a directory path with embedded quotes.
* **Diagnosis**: Understanding how path resolution functions on Windows across different shell environments reinforced the necessity of relative path references (`./`) over hardcoded drive-letter strings in tool and plugin manifests.

---

## 3. Architectural Decisions That Changed During Development

* **In-Memory Fallback for Zero-Config Local Evaluation**:
  Initially, the server expected an active MongoDB daemon on `mongodb://localhost:27017`. To ensure evaluators can run the project on any machine without installing MongoDB, we updated `server/src/config/db.ts` to seamlessly spin up an in-memory database instance if local MongoDB is not running.
* **Over-Budget Feedback Design**:
  Standard fitness trackers often display negative remaining calories (e.g. `-250 kcal left`), which can confuse users. We transitioned to an explicit `Over Budget (+250 kcal)` badge with amber/rose indicators to provide transparent dietary feedback.

---

## 4. Future Enhancements & Extensibility
* **Micro-Nutrient Tracking**: Expanding the food schema to monitor sodium, potassium, vitamin D, and saturated fat.
* **Water Intake Tracker**: Adding a hydration logging module with customizable daily water volume goals.
* **Recipe Builder**: Allowing users to combine multiple existing foods into a single composite custom meal item.
* **Exportable Health Reports**: Generating downloadable PDF reports summarizing 30-day nutritional compliance for dietitians.
