import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { seedFoods } from "../scripts/seedFoods.js";
import { Food } from "../models/Food.js";

describe("NutriTrack Backend API Integration Tests", () => {
  let user1Cookie: string;
  let user2Cookie: string;
  let sampleFoodId: string;
  let createdLogId: string;

  beforeAll(async () => {
    await connectDB();
    await seedFoods();
    const rice = await Food.findOne({ searchableName: "cooked white rice" });
    if (rice) {
      sampleFoodId = rice._id.toString();
    }
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("Health Check", () => {
    it("GET /api/v1/health returns 200 OK", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe("healthy");
    });
  });

  describe("Authentication Flow (FR-001 - FR-006)", () => {
    it("POST /api/v1/auth/register registers User 1 successfully", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test User One",
        email: "user1@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("user1@example.com");
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Security: never expose hash

      // Save cookie
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      user1Cookie = cookies[0];
    });

    it("POST /api/v1/auth/register rejects duplicate email with 409 Conflict", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Duplicate User",
        email: "USER1@EXAMPLE.COM", // tests normalization
        password: "Password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/register rejects invalid short password with 400 Bad Request", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Invalid Pass User",
        email: "invalid@example.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("Registers User 2 for multi-tenant isolation testing", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test User Two",
        email: "user2@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(201);
      const cookies = res.headers["set-cookie"];
      user2Cookie = cookies[0];
    });

    it("POST /api/v1/auth/login authenticates with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "user1@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("POST /api/v1/auth/login rejects incorrect password with 401 Unauthorized", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "user1@example.com",
        password: "WrongPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("GET /api/v1/auth/me returns current user profile when authenticated", async () => {
      const res = await request(app).get("/api/v1/auth/me").set("Cookie", user1Cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("user1@example.com");
    });

    it("GET /api/v1/auth/me rejects unauthenticated request with 401", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });
  });

  describe("Profile & Mifflin-St Jeor TDEE (FR-007 - FR-010)", () => {
    it("PATCH /api/v1/profile updates profile and recalculates targets", async () => {
      const res = await request(app)
        .patch("/api/v1/profile")
        .set("Cookie", user1Cookie)
        .send({
          age: 26,
          gender: "male",
          heightCm: 175,
          currentWeightKg: 75,
          activityLevel: "moderately_active",
          goal: "lose",
        });

      expect(res.status).toBe(200);
      const target = res.body.data.user.nutritionTarget;
      expect(target.calculationMode).toBe("automated");
      expect(target.targetCalories).toBeGreaterThan(1200);
    });

    it("PATCH /api/v1/profile accepts manual calorie target override", async () => {
      const res = await request(app)
        .patch("/api/v1/profile")
        .set("Cookie", user1Cookie)
        .send({
          calculationMode: "manual",
          customTargetCalories: 2250,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.nutritionTarget.targetCalories).toBe(2250);
      expect(res.body.data.user.nutritionTarget.calculationMode).toBe("manual");
    });
  });

  describe("Food Database & Search (FR-011 - FR-014)", () => {
    it("GET /api/v1/foods returns seeded foods", async () => {
      const res = await request(app).get("/api/v1/foods?q=rice").set("Cookie", user1Cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.foods.length).toBeGreaterThan(0);
      expect(res.body.data.foods[0].name.toLowerCase()).toContain("rice");
    });

    it("POST /api/v1/foods/custom creates custom food item for User 1", async () => {
      const res = await request(app)
        .post("/api/v1/foods/custom")
        .set("Cookie", user1Cookie)
        .send({
          name: "My Special Protein Shake",
          category: "Beverages",
          servingSize: 300,
          servingUnit: "ml",
          calories: 250,
          protein: 30,
          carbs: 20,
          fat: 5,
          fiber: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.food.isCustom).toBe(true);
    });
  });

  describe("Food Diary & Zero-Trust Server Calculation (FR-015 - FR-019)", () => {
    it("POST /api/v1/food-logs logs 150g rice and calculates scaled 195 kcal server-side", async () => {
      const res = await request(app)
        .post("/api/v1/food-logs")
        .set("Cookie", user1Cookie)
        .send({
          foodId: sampleFoodId,
          date: "2026-10-11",
          mealType: "Lunch",
          quantity: 150, // 100g = 130 kcal -> 150g = 195 kcal
          notes: "Steamed lunch",
        });

      expect(res.status).toBe(201);
      const log = res.body.data.log;
      expect(log.calories).toBe(195);
      expect(log.foodNameSnapshot).toBe("Cooked White Rice");
      createdLogId = log._id;
    });

    it("GET /api/v1/food-logs returns day summary with Lunch subtotal", async () => {
      const res = await request(app)
        .get("/api/v1/food-logs?date=2026-10-11")
        .set("Cookie", user1Cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.totalCalories).toBe(195);
      expect(res.body.data.meals.Lunch.items.length).toBe(1);
    });

    it("PATCH /api/v1/food-logs/:id rescales calories when quantity is updated to 200g", async () => {
      const res = await request(app)
        .patch(`/api/v1/food-logs/${createdLogId}`)
        .set("Cookie", user1Cookie)
        .send({
          quantity: 200, // 100g = 130 kcal -> 200g = 260 kcal
        });

      expect(res.status).toBe(200);
      expect(res.body.data.log.calories).toBe(260);
    });

    it("GET /api/v1/nutrition/daily verifies updated consumed calories", async () => {
      const res = await request(app)
        .get("/api/v1/nutrition/daily?date=2026-10-11")
        .set("Cookie", user1Cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.consumedCalories).toBe(260);
      expect(res.body.data.targetCalories).toBe(2250);
      expect(res.body.data.remainingCalories).toBe(2250 - 260);
    });
  });

  describe("Multi-Tenant Data Isolation (NFR-001)", () => {
    it("User 2 CANNOT edit User 1's food log entry", async () => {
      const res = await request(app)
        .patch(`/api/v1/food-logs/${createdLogId}`)
        .set("Cookie", user2Cookie)
        .send({ quantity: 500 });

      expect(res.status).toBe(404); // Scoped by userId
    });

    it("User 2 CANNOT delete User 1's food log entry", async () => {
      const res = await request(app)
        .delete(`/api/v1/food-logs/${createdLogId}`)
        .set("Cookie", user2Cookie);

      expect(res.status).toBe(404);
    });

    it("User 2's daily diary for the same date shows 0 calories", async () => {
      const res = await request(app)
        .get("/api/v1/food-logs?date=2026-10-11")
        .set("Cookie", user2Cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.totalCalories).toBe(0);
      expect(res.body.data.meals.Lunch.items.length).toBe(0);
    });
  });

  describe("Food Log Deletion & Recalculation", () => {
    it("DELETE /api/v1/food-logs/:id deletes log successfully", async () => {
      const res = await request(app)
        .delete(`/api/v1/food-logs/${createdLogId}`)
        .set("Cookie", user1Cookie);

      expect(res.status).toBe(200);

      // Verify diary is now 0
      const diaryRes = await request(app)
        .get("/api/v1/food-logs?date=2026-10-11")
        .set("Cookie", user1Cookie);
      expect(diaryRes.body.data.totalCalories).toBe(0);
    });
  });
});
