import { z } from "zod";
import { FOOD_CATEGORIES } from "../models/Food.js";

export const createCustomFoodSchema = z.object({
  name: z.string().trim().min(2, "Food name must be at least 2 characters").max(150),
  category: z.enum(FOOD_CATEGORIES),
  servingSize: z.number().positive("Serving size must be greater than 0"),
  servingUnit: z.string().trim().min(1, "Serving unit is required").max(30),
  calories: z.number().min(0, "Calories cannot be negative"),
  protein: z.number().min(0, "Protein cannot be negative"),
  carbs: z.number().min(0, "Carbohydrates cannot be negative"),
  fat: z.number().min(0, "Fat cannot be negative"),
  fiber: z.number().min(0, "Fiber cannot be negative").default(0),
});

export const searchFoodQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 30)),
});

export type CreateCustomFoodInput = z.infer<typeof createCustomFoodSchema>;
export type SearchFoodQuery = z.infer<typeof searchFoodQuerySchema>;
