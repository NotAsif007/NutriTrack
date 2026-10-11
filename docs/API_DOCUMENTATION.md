# REST API Specification
## NutriTrack — Smart Calorie & Nutrition Tracker API

**Base Path:** `/api/v1`  
**Data Format:** JSON  
**Authentication:** Cookie-based JWT (`token` stored in `HttpOnly` cookie)  

---

## 1. Global Headers & Status Codes

### Standard Response Codes
* `200 OK`: Request succeeded.
* `201 Created`: Resource successfully created.
* `400 Bad Request`: Validation failure or malformed payload.
* `401 Unauthorized`: Authentication missing, expired, or invalid.
* `403 Forbidden`: Resource belongs to another user.
* `404 Not Found`: Resource does not exist.
* `409 Conflict`: Duplicate resource (e.g. email already registered).
* `500 Internal Server Error`: Unexpected internal server condition.

---

## 2. Authentication Endpoints

### 2.1 Register User
* **Method:** `POST`
* **Route:** `/api/v1/auth/register`
* **Auth Required:** No
* **Request Body:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "Password123"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6708f53a8123abc456789012",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "profile": { ... },
      "nutritionTarget": { "targetCalories": 2000, "calculationMode": "automated" }
    }
  }
}
```
*(Also sets `Set-Cookie: token=...; HttpOnly; SameSite=Strict; Path=/`)*

### 2.2 Login User
* **Method:** `POST`
* **Route:** `/api/v1/auth/login`
* **Auth Required:** No
* **Request Body:**
```json
{
  "email": "aarav@example.com",
  "password": "Password123"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6708f53a8123abc456789012",
      "name": "Aarav Sharma",
      "email": "aarav@example.com"
    }
  }
}
```

### 2.3 Logout
* **Method:** `POST`
* **Route:** `/api/v1/auth/logout`
* **Auth Required:** Yes
* **Response (200 OK):** Clears cookie.

### 2.4 Current User Session
* **Method:** `GET`
* **Route:** `/api/v1/auth/me`
* **Auth Required:** Yes
* **Response (200 OK):** Returns current user record.

---

## 3. Profile & Goal Endpoints

### 3.1 Get Profile
* **Method:** `GET`
* **Route:** `/api/v1/profile`
* **Auth Required:** Yes

### 3.2 Update Profile & Nutrition Goals
* **Method:** `PATCH`
* **Route:** `/api/v1/profile`
* **Auth Required:** Yes
* **Request Body:**
```json
{
  "age": 24,
  "gender": "male",
  "heightCm": 178,
  "currentWeightKg": 74.5,
  "activityLevel": "moderately_active",
  "goal": "lose",
  "customTargetCalories": null
}
```
* **Response (200 OK):** Returns updated profile and recalculated TDEE targets.

---

## 4. Food Database Endpoints

### 4.1 Search Foods
* **Method:** `GET`
* **Route:** `/api/v1/foods?q=oats&category=Grains&limit=20`
* **Auth Required:** Yes
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "_id": "6708f53a8123abc456789099",
        "name": "Rolled Oats",
        "category": "Grains",
        "servingSize": 100,
        "servingUnit": "g",
        "calories": 389,
        "protein": 16.9,
        "carbs": 66.3,
        "fat": 6.9,
        "fiber": 10.6,
        "isCustom": false
      }
    ]
  }
}
```

### 4.2 Create Custom Food
* **Method:** `POST`
* **Route:** `/api/v1/foods/custom`
* **Auth Required:** Yes
* **Request Body:**
```json
{
  "name": "Homemade Protein Smoothie",
  "category": "Beverages",
  "servingSize": 350,
  "servingUnit": "ml",
  "calories": 280,
  "protein": 28,
  "carbs": 30,
  "fat": 4,
  "fiber": 5
}
```

---

## 5. Food Diary Endpoints

### 5.1 Fetch Daily Food Logs
* **Method:** `GET`
* **Route:** `/api/v1/food-logs?date=2026-10-11`
* **Auth Required:** Yes
* **Response (200 OK):** Returns entries organized by meal along with subtotals.

### 5.2 Create Food Log
* **Method:** `POST`
* **Route:** `/api/v1/food-logs`
* **Auth Required:** Yes
* **Request Body:**
```json
{
  "foodId": "6708f53a8123abc456789099",
  "date": "2026-10-11",
  "mealType": "Breakfast",
  "quantity": 50,
  "notes": "With almond milk"
}
```
* **Response (201 Created):** Server computes scaled calories (195 kcal), protein (8.5g), carbs (33.2g), fat (3.5g).

### 5.3 Update Food Log Entry
* **Method:** `PATCH`
* **Route:** `/api/v1/food-logs/:id`
* **Auth Required:** Yes
* **Request Body:** `{ "quantity": 75, "mealType": "Breakfast" }`

### 5.4 Delete Food Log Entry
* **Method:** `DELETE`
* **Route:** `/api/v1/food-logs/:id`
* **Auth Required:** Yes

---

## 6. Nutrition Analytics & Weight Tracking

### 6.1 Daily Nutrition Summary
* **Method:** `GET`
* **Route:** `/api/v1/nutrition/daily?date=2026-10-11`
* **Auth Required:** Yes
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2026-10-11",
    "targetCalories": 2100,
    "consumedCalories": 1420,
    "remainingCalories": 680,
    "isOverTarget": false,
    "macros": {
      "protein": { "consumed": 85.0, "target": 130 },
      "carbs": { "consumed": 160.0, "target": 220 },
      "fat": { "consumed": 42.0, "target": 65 }
    },
    "meals": {
      "Breakfast": { "calories": 380, "itemsCount": 3 },
      "Lunch": { "calories": 620, "itemsCount": 2 },
      "Dinner": { "calories": 420, "itemsCount": 2 },
      "Snacks": { "calories": 0, "itemsCount": 0 }
    }
  }
}
```

### 6.2 Weekly Progress (7-Day Rolling)
* **Method:** `GET`
* **Route:** `/api/v1/nutrition/weekly?endDate=2026-10-11`

### 6.3 Weight Logs (List & Create)
* **Method:** `GET`, `POST`
* **Route:** `/api/v1/weight-logs`
