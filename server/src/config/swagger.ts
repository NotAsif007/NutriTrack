import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "NutriTrack REST API Documentation",
    version: "1.0.0",
    description: "Production API for NutriTrack - Smart Calorie & Nutrition Tracker",
  },
  servers: [{ url: "/api/v1", description: "API v1 Base URL" }],
  paths: {
    "/health": {
      get: {
        summary: "Check API health status",
        responses: {
          "200": { description: "API is healthy and operational" },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered, session cookie set" },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Authenticate user and issue cookie",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/foods": {
      get: {
        summary: "Search food database",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Matching foods list" },
        },
      },
    },
    "/food-logs": {
      get: {
        summary: "Retrieve daily food diary entries",
        parameters: [
          { name: "date", in: "query", required: true, schema: { type: "string", example: "2026-10-11" } },
        ],
        responses: { "200": { description: "Daily diary breakdown" } },
      },
      post: {
        summary: "Log a food entry to a meal",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["date", "mealType", "quantity"],
                properties: {
                  foodId: { type: "string" },
                  date: { type: "string", example: "2026-10-11" },
                  mealType: { type: "string", enum: ["Breakfast", "Lunch", "Dinner", "Snacks"] },
                  quantity: { type: "number", example: 150 },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Entry added with server-calculated nutrition" } },
      },
    },
    "/nutrition/daily": {
      get: {
        summary: "Get daily nutrition summary and target comparisons",
        parameters: [
          { name: "date", in: "query", schema: { type: "string", example: "2026-10-11" } },
        ],
        responses: { "200": { description: "Daily summary details" } },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
