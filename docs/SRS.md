# Software Requirements Specification (SRS)
## NutriTrack — Smart Calorie & Nutrition Tracker

**Document Version:** 1.0.0  
**Project Category:** B.Tech Computer Science & Engineering Capstone / Mini-Project  
**Author:** Senior Full-Stack Engineering Team  
**Date:** October 2026  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for **NutriTrack**, a web application engineered to enable individuals to monitor daily calorie consumption, track macronutrient distributions, log meals across custom dates, calculate resting energy requirements, and review historical nutritional trends.

### 1.2 Document Conventions
* **FR-xxx**: Functional Requirement identifier.
* **NFR-xxx**: Non-Functional Requirement identifier.
* **TDEE**: Total Daily Energy Expenditure.
* **REE / BMR**: Resting Energy Expenditure / Basal Metabolic Rate.
* **MSJ**: Mifflin-St Jeor Equation.

### 1.3 Intended Audience
* Academic evaluators and project examiners.
* Software architects, full-stack engineers, and QA engineers.
* End-users and fitness practitioners.

---

## 2. Project Overview & Problem Statement

### 2.1 Problem Statement
Maintaining an optimal dietary regimen is challenging due to the cognitive overhead of manual calorie calculation, inconsistent serving size definitions, and disorganized physical or note-based diaries. Many existing commercial applications are bloated with intrusive advertisements, compulsory paywalls, and social feeds, detracting from the core utility of nutrition monitoring.

### 2.2 Proposed Solution
NutriTrack provides an uncluttered, responsive, evidence-based nutrition tracking system. It integrates:
1. An empirical food database with Indian and continental staples.
2. Mathematically verified Mifflin-St Jeor daily energy expenditure calculations.
3. Server-enforced nutrient scaling with historical log immutability.
4. Real-time daily dashboard and rolling historical progress tracking.
5. Strict multi-tenant isolation through secure cookie-based session management.

---

## 3. Scope & Exclusions

### 3.1 In Scope
* User registration, authentication, and secure session management via HttpOnly cookies.
* User physical profile management (age, sex, height in cm, weight in kg, activity level, goal).
* Automated Mifflin-St Jeor REE and TDEE calculation with manual target override.
* Standard food directory with search, categorization, and serving metrics.
* Custom user-created food item management.
* Comprehensive food diary supporting Breakfast, Lunch, Dinner, and Snacks.
* Real-time calculation of calories and macronutrients (protein, carbs, fat, fiber).
* Visual dashboard with target progress rings, meal breakdowns, and remaining budgets.
* 7-day and monthly analytics charts distinguishing logged days from non-logged days.
* Weight history log and chronological trend visualization.
* Account deletion and personal data cleanup.

### 3.2 Out of Scope
* Computer-vision / AI food recognition from camera images.
* Barcode scanner integration (hardware camera dependency).
* Payment gateways or premium tier monetization.
* Public social media sharing or social feeds.

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
* **FR-001**: The system shall allow users to register using name, email, and password.
* **FR-002**: The system shall normalize email addresses to lowercase and reject duplicate registrations.
* **FR-003**: The system shall hash passwords using `bcrypt` (salt rounds $\ge 10$) before persistence.
* **FR-004**: The system shall authenticate users with email and password, issuing a signed JWT in an `HttpOnly`, `SameSite=Strict` cookie.
* **FR-005**: The system shall invalidate client sessions upon user logout.
* **FR-006**: The system shall restrict private API endpoints to authenticated users only.

### 4.2 Profile & Goals
* **FR-007**: The system shall capture user profile attributes: age, biological sex, height (cm), current weight (kg), activity multiplier, and fitness goal.
* **FR-008**: The system shall calculate REE via the Mifflin-St Jeor formula and adjust for TDEE using empirical multipliers.
* **FR-009**: The system shall allow the user to select between calculated targets or enter a custom calorie target override.
* **FR-010**: Profile updates shall not retroactively alter previously persisted food diary logs.

### 4.3 Food Database & Custom Foods
* **FR-011**: The system shall provide a curated catalog of global and regional foods with reference serving quantities (grams, milliliters, pieces).
* **FR-012**: The system shall support case-insensitive, partial-match food search and category filtering.
* **FR-013**: The system shall allow users to create custom food items with name, serving size, unit, calories, and macronutrients.
* **FR-014**: Custom food items shall remain private to the creating user.

### 4.4 Food Diary & Nutrition Calculation
* **FR-015**: The system shall support logging foods into four categories: `Breakfast`, `Lunch`, `Dinner`, `Snacks`.
* **FR-016**: The system shall support arbitrary calendar dates for food diary logging and historical review.
* **FR-017**: The system shall calculate nutrient values on the server:  
  $$\text{Scaled Value} = \frac{\text{Logged Quantity}}{\text{Reference Serving}} \times \text{Reference Nutrient}$$
* **FR-018**: The system shall snapshot the food name and calculated nutrients directly into the `FoodLog` document to guarantee historical immutability.
* **FR-019**: The system shall allow editing quantities or meal categories and deleting existing log entries.

### 4.5 Dashboard & Progress Analytics
* **FR-020**: The dashboard shall display daily consumed calories, daily target, and remaining/over-target calories.
* **FR-021**: The dashboard shall render consumed protein, carbohydrate, and fat totals alongside configured targets.
* **FR-022**: The system shall generate a 7-day rolling calorie chart comparing intake to daily targets.
* **FR-023**: The system shall generate 30-day statistics: daily average intake, highest intake, lowest intake, and active logging days.
* **FR-024**: The system shall allow users to log weight measurements with dates and view trend charts.

---

## 5. Non-Functional Requirements (NFR)

* **NFR-001 (Security)**: Password hashes shall never appear in API responses. Session tokens must be inaccessible to client-side JavaScript via `HttpOnly` cookie flags.
* **NFR-002 (Data Isolation)**: All user data operations must filter explicitly on `userId` extracted from the verified JWT.
* **NFR-003 (Validation)**: All incoming payloads must be strictly validated by Zod schemas prior to controller execution.
* **NFR-004 (Precision)**: Micronutrients and macronutrients shall be stored with 1 decimal place precision; calories rounded to whole numbers.
* **NFR-005 (Responsiveness)**: The interface shall adapt to viewports from 360px to 1920px without horizontal overflow.
* **NFR-006 (Performance)**: Common API responses shall complete under 200ms under standard local operating conditions.
* **NFR-007 (Error Handling)**: The API shall return uniform JSON error objects: `{ success: false, error: { code, message, details } }`.

---

## 6. User Stories & Acceptance Criteria

### US-1: User Registration & Onboarding
* **As a** new user,  
* **I want to** register with my email and physical profile,  
* **So that** I receive personalized daily calorie recommendations.  
* **Acceptance Criteria**: Form validates email format; rejects password $<8$ characters; computes Mifflin-St Jeor target upon valid input; securely logs in user upon completion.

### US-2: Fast Food Logging
* **As a** daily tracker,  
* **I want to** search for "Boiled Egg" and enter "2 piece",  
* **So that** NutriTrack automatically calculates calories and macros.  
* **Acceptance Criteria**: Search matches within 2 keystrokes; preview displays calculated values; saving persists entry and updates dashboard totals immediately.

### US-3: Nutritional History Review
* **As an** individual reviewing progress,  
* **I want to** inspect my 7-day intake chart,  
* **So that** I can assess adherence to my caloric targets.  
* **Acceptance Criteria**: Days with no logs are visibly distinct from days with zero calorie intake; average intake accurately aggregates logged days.
