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

### 3.1 Quick Meal & Activity Logging (Center Action Button)
* **One-Tap Quick Log Popup**: Tap the prominent elevated circular **`+`** button in the center of the mobile navigation bar (or click **+ Log Food** in the desktop header).
* A frosted **Quick Log Action Sheet** opens with instant shortcuts:
  * 🍳 **Breakfast** (450–650 kcal) → Opens food search pre-configured for morning fuel.
  * 🥗 **Lunch** (500–750 kcal) → Opens food search for midday meals.
  * 🍲 **Dinner** (500–700 kcal) → Opens food search for evening protein.
  * 🍎 **Snacks** (150–300 kcal) → Opens food search for light bites.
  * 💧 **+250ml Water** → One-tap hydration logging with immediate visual confirmation.
  * ⚖️ **Weight** → Instant morning weigh-in recorder.
  * 🍽️ **Custom Food** → Quick shortcut to custom food creation.
* **Direct Meal Logging**: Alternatively, click the circular **`+`** button next to any meal card on the Dashboard or Food Diary.
* In the **Food Search Modal**:
  1. Type the food name or pick a category filter.
  2. Select the matching food item.
  3. Review the standard serving size, pick a quick multiplier pill (`0.5x`, `1x`, `1.5x`, `2x`), or enter custom quantity.
  4. View the live scaled calorie, protein, carb, fat, and fiber totals.
  5. Click **Add to Meal**. Dashboard counters and circular donut gauges update in real-time.

### 3.2 Modifying or Deleting a Food Log Entry
* **Edit Quantity**: Click the **pencil icon** next to the food entry, enter the new quantity, and click the green checkmark. NutriTrack automatically rescales calories and macros.
* **Delete Entry**: Click the **trash icon** next to any entry. A confirmation dialog will appear. Click **Remove Entry** to confirm deletion.

### 3.3 Navigating Between Dates
* Use the **<** and **>** buttons in the **Date Navigator** to step through previous or future dates.
* Click **Jump to Today** to instantly return to today's date.
* Click the calendar input to jump directly to any date.

### 3.4 Daily Water Intake & Hydration Tracker
* On the Dashboard, locate the **Daily Hydration** widget.
* Use the one-click quick logging buttons:
  * **+250 ml** (1 Glass 🥛)
  * **+500 ml** (1 Bottle 💧)
  * **+750 ml** (Flask 🧊)
  * **-250 ml** (Undo)
* As you log water, the animated gradient bar fills toward your 2,500 ml target. Reaching your daily target unlocks the **Goal Reached!** celebration badge.
* Intake is automatically preserved per date.

### 3.5 1-Click Nutrition Export & Coach Sharing
* In either the **Dashboard** or **Food Diary**, click the **Export Day** / **Export** button.
* NutriTrack generates an instant formatted report summarizing:
  * Calories budget, consumed energy, and balance
  * Macronutrient target vs consumed breakdowns (Protein, Carbs, Fat, Fiber)
  * Detailed itemized meal logs by category (Breakfast, Lunch, Dinner, Snacks)
* Click **Copy Report Text** to paste into WhatsApp, email, or Notion for your personal trainer/nutritionist.
* Click **Download JSON** for structured machine-readable backups.

### 3.6 Portion Multipliers & Live Macro Ratios
* When logging food in the search modal, use the quick multiplier pills (`0.5x`, `1x`, `1.5x`, `2x`) to set common portion amounts instantly.
* The modal calculates live calorie and macro totals, including the % distribution of calories originating from Protein, Carbs, and Fat.

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

## 6. App Appearance & Color Theme Customization
NutriTrack features a live dynamic Theme Engine that transforms the visual aesthetic across all components without page reload:
1. Navigate to **Profile & Goals** (`/profile`).
2. Under the **App Appearance & Color Theme** section, choose from 6 curated palettes:
   * **Emerald Mint** (Default): Fresh crisp green for balanced wellness.
   * **Royal Indigo**: Deep modern purple & violet accents (*inspired by Inspo Reference 1*).
   * **Nutrio Lime**: High-energy athletic lime (*inspired by Inspo References 2 & 3*).
   * **Ocean Cyan**: Cool tech cyan for calm focus and hydration.
   * **Sunset Coral**: Energizing warm amber/coral for calorie burning.
   * **Rose Berry**: Playful berry & magenta wellness aesthetic.
3. Clicking any theme immediately recolors navigation links, hero circular donut rings, charts, badges, and action buttons. The selected theme persists in your browser's local storage.

---

## 7. Account Deletion & Data Privacy
1. Navigate to **Profile & Goals**.
2. Scroll to the bottom and click **Delete Account**.
3. Confirm the action in the security dialog. All your profile information, historical food logs, weight entries, and custom foods will be permanently purged from the database.

---

## 8. Cross-Device Responsive Layouts
NutriTrack delivers a tailored experience across all screen sizes:
* **Mobile Smartphones (< 768px)**:
  * Minimal **Instagram-style top sticky header** displaying the brand wordmark **NutriTrack** alongside dynamic greetings (*Good morning / Good afternoon / Good evening*).
  * Completely **hidden vertical scrollbars** (`scrollbar-width: none`) delivering an edge-to-edge native mobile app feel.
  * Hero **Daily Calorie Budget** circular donut gauge positioned first at the top of the feed for zero-scroll glanceability.
  * Floating pill bottom navigation with frosted glass backdrop and elevated center **`+`** quick-log button.
* **Tablets (768px – 1023px)**:
  * Compact **72px icon-rail sidebar** preserving vertical workspace.
  * Balanced **2-column grid** pairing hero calories with macro donut gauges and planned meals alongside analytics cards.
* **Desktops & Laptops (≥ 1024px)**:
  * Expanded **260px sidebar** with feature descriptions and daily calorie target indicator.
  * Clean top header with brand title, greetings, theme selector, and quick log shortcuts.
  * Comprehensive multi-column analytics view with rolling charts, streaks, and hydration progress.

