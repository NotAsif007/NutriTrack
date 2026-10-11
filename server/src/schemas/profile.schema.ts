import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  age: z.number().int().min(10, "Age must be at least 10").max(120, "Age must be under 120").optional().nullable(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  heightCm: z.number().min(50, "Height must be at least 50 cm").max(250, "Height must be under 250 cm").optional().nullable(),
  currentWeightKg: z.number().min(20, "Weight must be at least 20 kg").max(400, "Weight must be under 400 kg").optional().nullable(),
  activityLevel: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"])
    .optional(),
  goal: z.enum(["maintain", "lose", "gain"]).optional(),
  dietaryPreference: z.string().max(100).optional(),
  customTargetCalories: z.number().int().min(800, "Daily calorie target must be at least 800 kcal").max(10000).optional().nullable(),
  calculationMode: z.enum(["automated", "manual"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
