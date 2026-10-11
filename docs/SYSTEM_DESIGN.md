# System Design Document
## NutriTrack — Smart Calorie & Nutrition Tracker

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Architecture Style:** Layered REST API + SPA (Client-Server Monorepo)  

---

## 1. Architectural Overview

NutriTrack adheres to a clean, decoupled client-server architecture:
* **Presentation Layer (Client)**: Single Page Application (SPA) built with React 19 / Vite, TypeScript, Tailwind CSS, Lucide icons, React Hook Form, and TanStack Query.
* **Application / API Layer (Server)**: Modular Express.js REST application in TypeScript, following a Controller-Service-Repository pattern.
* **Persistence Layer (Database)**: MongoDB with Mongoose ODM, leveraging document embedding for snapshots and normalized collections for users and food catalogs.

```mermaid
flowchart TD
    subgraph Browser ["Client Architecture (React SPA)"]
        UI["UI Components (Tailwind & Lucide)"]
        Forms["React Hook Form + Zod Validation"]
        Query["TanStack Query (Cache & State)"]
        ClientAPI["Axios API Client (HttpOnly Auth)"]
        UI --> Forms --> Query --> ClientAPI
    end

    subgraph Network ["Transport Security"]
        HTTPS["HTTP/REST with Secure HttpOnly Cookies"]
    end

    subgraph ServerApp ["Server Architecture (Express + TS)"]
        SecurityMW["Security MW: Helmet, CORS, RateLimit"]
        AuthMW["JWT Auth & Cookie Verification MW"]
        ValMW["Zod Request Body Validation MW"]
        Controllers["Domain Controllers (Auth, Diary, Foods, Profile)"]
        Services["Business Services (Nutrition Calculation Engine)"]
        Mongoose["Mongoose Data Access Layer"]
        SecurityMW --> AuthMW --> ValMW --> Controllers --> Services --> Mongoose
    end

    subgraph DB ["Data Persistence"]
        MongoStore[("MongoDB Database")]
        Mongoose --> MongoStore
    end

    ClientAPI <-->|REST Requests & Responses| SecurityMW
```

---

## 2. Authentication Flow

Authentication utilizes signed JSON Web Tokens (JWT) stored in HTTP-Only, SameSite cookies to protect against Cross-Site Scripting (XSS) and unauthorized token harvesting.

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Client as React Client
    participant AuthAPI as Express Auth Controller
    participant Service as AuthService
    participant DB as MongoDB

    User->>Client: Enters Email & Password
    Client->>AuthAPI: POST /api/v1/auth/login {email, password}
    AuthAPI->>Service: authenticate(email, password)
    Service->>DB: findOne({ email: normalizedEmail })
    DB-->>Service: User Document with passwordHash
    Service->>Service: bcrypt.compare(password, passwordHash)
    alt Credentials Valid
        Service->>Service: signJwtToken({ userId: user._id })
        Service-->>AuthAPI: { userSummary, token }
        AuthAPI-->>Client: Set-Cookie: token=JWT; HttpOnly; SameSite=Strict; Path=/<br/>200 OK { success: true, data: userSummary }
        Client->>User: Redirects to Dashboard
    else Invalid Credentials
        AuthAPI-->>Client: 401 Unauthorized { success: false, error: "Invalid credentials" }
        Client->>User: Displays validation alert
    end
```

---

## 3. Food Logging & Calculation Workflow

The food-logging workflow guarantees zero-trust calculation. The client never computes or dictates persisted nutrients.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant DiaryUI as Diary UI
    participant API as Express API (/api/v1/food-logs)
    participant Calc as Nutrition Calc Engine
    participant DB as MongoDB

    User->>DiaryUI: Selects Food & Enters Quantity (e.g. 150g Rice)
    DiaryUI->>API: POST /api/v1/food-logs { foodId, date, mealType, quantity }
    API->>API: Validate input schema with Zod
    API->>DB: Fetch reference food (100g Rice = 130 kcal, 2.7g P, 28g C, 0.3g F)
    DB-->>API: Food Document
    API->>Calc: scaleNutrients(referenceFood, loggedQuantity: 150)
    Calc->>Calc: Scale = 150 / 100 = 1.5
    Calc->>Calc: Calories = 130 * 1.5 = 195 kcal
    Calc->>Calc: Protein = round1dp(2.7 * 1.5) = 4.1g
    Calc->>Calc: Carbs = round1dp(28 * 1.5) = 42.0g
    Calc->>Calc: Fat = round1dp(0.3 * 1.5) = 0.5g
    Calc-->>API: Scaled Nutrition Snapshot
    API->>DB: Save FoodLog { userId, foodNameSnapshot, nutrients, date, mealType }
    DB-->>API: Saved Document
    API-->>DiaryUI: 201 Created { success: true, data: savedLog }
    DiaryUI->>User: Instantaneous subtotal and daily budget refresh
```

---

## 4. Error Handling Strategy

All system errors conform to a standardized JSON schema:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | INTERNAL_ERROR",
    "message": "Human-readable summary of the issue.",
    "details": []
  }
}
```

* **Zod Validation Middleware**: Catches bad payloads and maps issues to `{ field, issue }` without executing business logic.
* **AppError Class**: Custom operational error class carrying HTTP status codes and machine-readable error codes.
* **Global Error Handler**: Intercepts unhandled exceptions, sanitizes database errors (e.g. duplicate key code 11000), logs errors with stack traces on the server, and ensures sensitive internal details are never exposed to clients.

---

## 5. UI/UX Design System & Theme Engine Architecture

NutriTrack implements a reactive design system driven by dynamic CSS Custom Properties and Tailwind CSS tokens:

```
[ThemeContext] (State: 'emerald' | 'indigo' | 'lime' | 'ocean' | 'coral' | 'rose')
      |
      +---> Sets <html data-theme="..."> attribute
      |
      +---> CSS Variables in index.css:
      |       --color-primary-50 through --color-primary-900 (RGB triples)
      |       --theme-primary-hex (Hex code for SVG & Recharts)
      |
      +---> Tailwind config extends colors:
      |       emerald: rgb(var(--color-primary-*) / <alpha-value>)
      |       primary: rgb(var(--color-primary-*) / <alpha-value>)
      |
      +---> All UI elements (Buttons, SVG donut gauges, Recharts bars,
            Active nav indicators, Gradients, Badges) immediately update live.
```

### Supported Palettes:
1. **Emerald Mint** (`#10B981`): Balanced health & vitality (Default).
2. **Royal Indigo** (`#6366F1`): Deep modern purple aesthetic (*from Inspo Kit 1*).
3. **Nutrio Lime** (`#84CC16`): High-energy athletic lime (*from Inspo Kit 2 & 3*).
4. **Ocean Cyan** (`#0EA5E9`): Cool executive cyan for focus & hydration.
5. **Sunset Coral** (`#F97316`): Warm performance coral for calorie burning.
6. **Rose Berry** (`#F43F5E`): Vibrant berry wellness aesthetic.

---

## 6. Global Quick Log Architecture & Action Sheet

NutriTrack employs a centralized Quick Log orchestrator:

```
[MobileNav / Desktop Header]
      | (Click Center '+' Button)
      v
[QuickLogContext.openQuickLog()]
      |
      +---> Renders [QuickLogPopup] (Frosted bottom sheet/dialog)
              |
              +---> Breakfast / Lunch / Dinner / Snacks
              |       └──> Calls openFoodSearch(meal) -> Renders [FoodSearchModal]
              |
              +---> +250ml Water Shortcut
              |       └──> Direct POST /water-logs with visual confirmation
              |
              +---> Weight Weigh-in
              |       └──> Calls openWeightModal() -> Renders [WeightTrackerModal]
              |
              +---> Custom Food
                      └──> Calls openCustomFoodModal() -> Renders [CustomFoodModal]
```

This decoupled architecture allows triggering meal searches, hydration logs, and weigh-ins from anywhere across the application without tight coupling between page views and modal logic.

