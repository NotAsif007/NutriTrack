import { Router } from "express";
import { NutritionController } from "../controllers/nutrition.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const nutritionRouter = Router();

nutritionRouter.use(requireAuth);
nutritionRouter.get("/daily", NutritionController.getDailySummary);
nutritionRouter.get("/weekly", NutritionController.getWeeklySummary);
nutritionRouter.get("/monthly", NutritionController.getMonthlySummary);
