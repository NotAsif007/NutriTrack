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
* **Auth Required:** Yes
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "days": [
      {
        "date": "2026-10-05",
        "consumedCalories": 1950,
        "targetCalories": 2000,
        "protein": 110,
        "carbs": 210,
        "fat": 58,
        "isLogged": true
      },
      {
        "date": "2026-10-11",
        "consumedCalories": 1420,
        "targetCalories": 2000,
        "protein": 85,
        "carbs": 160,
        "fat": 42,
        "isLogged": true
      }
    ],
    "averageCalories": 1820,
    "activeDays": 6,
    "streakDays": 5
  }
}
```

### 6.3 Weight Logs (List & Create)
* **Method:** `GET`
* **Route:** `/api/v1/weight-logs`
* **Auth Required:** Yes
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "6708f53a8123abc456789123",
        "userId": "6708f53a8123abc456789012",
        "weightKg": 74.5,
        "date": "2026-10-11",
        "notes": "Morning weigh-in before breakfast",
        "createdAt": "2026-10-11T08:30:00.000Z"
      }
    ]
  }
}
```

* **Method:** `POST`
* **Route:** `/api/v1/weight-logs`
* **Auth Required:** Yes
* **Request Body:**
```json
{
  "weightKg": 74.2,
  "date": "2026-10-11",
  "notes": "Fasted"
}
```
* **Response (201 Created):** Returns created weight entry.

### 6.4 Delete Weight Log
* **Method:** `DELETE`
* **Route:** `/api/v1/weight-logs/:id`
* **Auth Required:** Yes
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Weight log deleted successfully"
}
```

---

## 7. Operational & System Endpoints

### 7.1 Service Health Check
* **Method:** `GET`
* **Route:** `/api/v1/health`
* **Auth Required:** No
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "NutriTrack API is fully operational.",
  "status": "healthy",
  "timestamp": "2026-10-11T15:20:00.000Z",
  "version": "1.0.0"
}
```

### 7.2 Interactive Swagger OpenAPI Documentation
* **Method:** `GET`
* **Route:** `/api/docs`
* **Auth Required:** No (Development & Staging)
* **Description:** Interactive Swagger UI rendering the OpenAPI 3.0 specification for endpoint inspection and live testing.

---

## 8. Server Configuration & Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `5000` | Port for the Express REST server. |
| `NODE_ENV` | String | `development` | Environment mode (`development`, `production`, `test`). |
| `MONGODB_URI` | String | `mongodb://localhost:27017/nutritrack` | Connection URI for MongoDB replica or standalone. Auto-falls back to in-memory MongoDB in dev/testing if offline. |
| `JWT_SECRET` | String | (required in prod) | Cryptographic signing secret for JSON Web Tokens. |
| `JWT_EXPIRES_IN` | String | `7d` | Lifetime of issued authentication tokens. |
| `CLIENT_ORIGIN` | String | `http://localhost:5173` | Allowed CORS origin for credentials-based requests. |
| `COOKIE_SECURE` | Boolean | `false` | When `true`, enforces HTTPS `Secure` cookie flag in production. |

