export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
export type NutritionGoal = "maintain" | "lose" | "gain";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export interface IUserProfile {
  age?: number;
  gender?: Gender;
  heightCm?: number;
  currentWeightKg?: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  dietaryPreference?: string;
}

export interface INutritionTarget {
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  calculationMode: "automated" | "manual";
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profile: IUserProfile;
  nutritionTarget: INutritionTarget;
  createdAt: string;
}

export interface IFood {
  _id: string;
  name: string;
  searchableName: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isCustom: boolean;
  creatorId?: string | null;
  dataSource: string;
}

export interface IFoodLog {
  _id: string;
  userId: string;
  foodId?: string | null;
  foodNameSnapshot: string;
  date: string;
  mealType: MealType;
  quantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes?: string;
  createdAt: string;
}

export interface IWeightLog {
  _id: string;
  userId: string;
  weightKg: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface MealSummary {
  mealType: MealType;
  items: IFoodLog[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DayDiarySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: Record<MealType, MealSummary>;
}

export interface DailyNutritionSummary {
  date: string;
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  isOverTarget: boolean;
  overTargetCalories: number;
  percentage: number;
  macros: {
    protein: { consumed: number; target: number };
    carbs: { consumed: number; target: number };
    fat: { consumed: number; target: number };
    fiber: { consumed: number; target: number };
  };
  meals: Record<
    MealType,
    {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      itemCount: number;
    }
  >;
}

export interface WeeklyNutritionSummary {
  days: Array<{
    date: string;
    calories: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    hasLogs: boolean;
  }>;
  targetCalories: number;
  averageCalories: number;
  loggedDaysCount: number;
  totalTrackedDays: number;
}

export interface MonthlyNutritionSummary {
  days: Array<{
    date: string;
    calories: number;
    targetCalories: number;
    hasLogs: boolean;
  }>;
  targetCalories: number;
  averageCalories: number;
  highestCalories: number;
  lowestCalories: number;
  loggedDaysCount: number;
  totalTrackedDays: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
}
