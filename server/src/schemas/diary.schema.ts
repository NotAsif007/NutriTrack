import { z } from "zod";
import { MEAL_TYPES } from "../models/FoodLog.js";

export const createFoodLogSchema = z.object({
  foodId: z.string().optional(),
  customFoodName: z.string().trim().min(1).max(150).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
  mealType: z.enum(MEAL_TYPES),
  quantity: z.number().positive("Quantity must be greater than 0"),
  notes: z.string().max(500).optional(),
  // Optional direct macro input if logging a custom quick entry without an existing food item
  manualNutrients: z
    .object({
      servingSize: z.number().positive(),
      servingUnit: z.string().min(1),
      calories: z.number().min(0),
      protein: z.number().min(0),
      carbs: z.number().min(0),
      fat: z.number().min(0),
      fiber: z.number().min(0).default(0),
    })
    .optional(),
});

export const updateFoodLogSchema = z.object({
  quantity: z.number().positive("Quantity must be greater than 0").optional(),
  mealType: z.enum(MEAL_TYPES).optional(),
  notes: z.string().max(500).optional(),
});

export const getDiaryQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
});

export type CreateFoodLogInput = z.infer<typeof createFoodLogSchema>;
export type UpdateFoodLogInput = z.infer<typeof updateFoodLogSchema>;
