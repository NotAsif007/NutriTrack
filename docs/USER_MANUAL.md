# NutriTrack — User Manual & Operational Guide

Welcome to **NutriTrack**, your smart calorie and nutrition tracking companion. This manual guides you through using all features of the application.

---

## 1. Getting Started

### 1.1 Account Registration
1. Navigate to `http://localhost:5173/register` (or your deployed URL).
2. Enter your **Full Name**, a valid **Email Address**, and a secure **Password** (minimum 8 characters with at least one letter and one number).
3. Confirm your password and click **Register & Start Tracking**.
4. You will be authenticated automatically and redirected to your Dashboard.

### 1.2 Signing In & Out
* **Sign In**: Navigate to `/login`, provide your registered email and password, and click **Sign In**.
* **Sign Out**: Click the **Log Out** button at the bottom of the desktop sidebar or the top-right header on mobile devices.

---

## 2. Setting Up Your Physical Profile & Nutrition Targets

1. Click on **Profile & Goals** in the navigation menu.
2. Fill in your physical metrics:
   * **Age** (e.g., 25 years)
   * **Biological Sex** (Male, Female, or Prefer not to say)
   * **Height in cm** (e.g., 175 cm)
   * **Current Weight in kg** (e.g., 72.5 kg)
3. Select your **Activity Multiplier**:
   * *Sedentary (1.2x)*: Office desk work, minimal exercise.
   * *Lightly Active (1.375x)*: Light exercise 1–3 days/week.
   * *Moderately Active (1.55x)*: Moderate workouts 3–5 days/week.
   * *Very Active (1.725x)*: Intense sports/workouts 6–7 days/week.
   * *Extra Active (1.9x)*: Hard physical labor or athletic conditioning.
4. Select your **Weight Goal**:
   * *Maintain Weight*: Balances energy intake directly at your TDEE.
   * *Lose Weight*: Applies an evidence-based moderate deficit of 500 kcal/day.
   * *Gain Weight*: Adds a lean surplus of 350 kcal/day.
5. Select your **Target Mode**:
   * **Automated (Recommended)**: Dynamically calculates your target calories and macronutrients (25% protein, 50% carbs, 25% fat) using the Mifflin-St Jeor formula.
   * **Manual Override**: Allows entering a fixed daily calorie target of your choice.
6. Click **Save Profile & Goals**.

---

## 3. Daily Food Logging & Diary Management

### 3.1 Logging a Meal
1. From the **Dashboard** or **Food Diary**, click **+ Log Food** or click **+ Add Food** inside any meal section (*Breakfast*, *Lunch*, *Dinner*, *Snacks*).
2. Type the food name (e.g., `"Boiled Egg"`, `"White Rice"`, `"Oats"`) or pick a category filter.
3. Select the matching food item.
4. Review the reference standard serving and enter your **Quantity** (e.g. 150 grams, 2 pieces).
5. Watch the **Calculated Nutrition Preview** update in real-time.
6. Click **Add to Meal**. The meal subtotal, daily consumed total, and remaining budget update immediately.

### 3.2 Modifying or Deleting a Food Log Entry
* **Edit Quantity**: Click the **pencil icon** next to the food entry, enter the new quantity, and click the green checkmark. NutriTrack automatically rescales calories and macros.
* **Delete Entry**: Click the **trash icon** next to any entry. A confirmation dialog will appear. Click **Remove Entry** to confirm deletion.

### 3.3 Navigating Between Dates
* Use the **<** and **>** buttons in the **Date Navigator** to step through previous or future dates.
* Click **Jump to Today** to instantly return to today's date.
* Click the calendar input to jump directly to any date.

---

## 4. Custom Food Management

If you consume a custom protein shake, packaged snack, or family recipe not present in the standard library:
1. Navigate to **Food Catalog** (`/foods`) and click **+ Create Custom Food**.
2. Enter the food name, select a category, and specify the reference serving size (e.g. 250 ml or 100 g).
3. Input the reference calories, protein, carbohydrates, fat, and fiber.
4. Click **Save Custom Food**.
5. Your custom food is now searchable in your diary with a special **Custom** badge, isolated strictly to your account.

---

## 5. Reviewing Progress & Weight Tracking

1. Navigate to **Progress & History** (`/progress`).
2. **7-Day Caloric Chart**: Shows daily calories consumed versus your daily calorie target line.
3. **30-Day Monthly Highlights**: Displays active logged days, average intake, highest intake, and lowest intake.
4. **Body Weight History**:
   * Click **+ Log Weight**.
   * Enter today's weight measurement (in kg) and optional notes.
   * The chronological line chart plots your weigh-in history to visualize long-term trends.

---

## 6. Account Deletion & Data Privacy
1. Navigate to **Profile & Goals**.
2. Scroll to the bottom and click **Delete Account**.
3. Confirm the action in the security dialog. All your profile information, historical food logs, weight entries, and custom foods will be permanently purged from the database.
