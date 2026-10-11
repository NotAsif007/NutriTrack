import { FoodLog, IFoodLog, MealType, MEAL_TYPES } from "../models/FoodLog.js";
import { Food } from "../models/Food.js";
import { AppError } from "../utils/AppError.js";
import { CreateFoodLogInput, UpdateFoodLogInput } from "../schemas/diary.schema.js";
import { scaleNutrition, roundTo1Decimal } from "../utils/nutritionCalculator.js";

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

export class DiaryService {
  static async getDiaryByDate(userId: string, date: string): Promise<DayDiarySummary> {
    const logs = await FoodLog.find({ userId, date }).sort({ createdAt: 1 });

    const meals: Record<MealType, MealSummary> = {
      Breakfast: { mealType: "Breakfast", items: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      Lunch: { mealType: "Lunch", items: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      Dinner: { mealType: "Dinner", items: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      Snacks: { mealType: "Snacks", items: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    for (const log of logs) {
      if (meals[log.mealType]) {
        meals[log.mealType].items.push(log);
        meals[log.mealType].calories += log.calories;
        meals[log.mealType].protein = roundTo1Decimal(meals[log.mealType].protein + log.protein);
        meals[log.mealType].carbs = roundTo1Decimal(meals[log.mealType].carbs + log.carbs);
        meals[log.mealType].fat = roundTo1Decimal(meals[log.mealType].fat + log.fat);
        meals[log.mealType].fiber = roundTo1Decimal(meals[log.mealType].fiber + log.fiber);
      }

      totalCalories += log.calories;
      totalProtein = roundTo1Decimal(totalProtein + log.protein);
      totalCarbs = roundTo1Decimal(totalCarbs + log.carbs);
      totalFat = roundTo1Decimal(totalFat + log.fat);
      totalFiber = roundTo1Decimal(totalFiber + log.fiber);
    }

    return {
      date,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      meals,
    };
  }

  static async addFoodLog(userId: string, input: CreateFoodLogInput): Promise<IFoodLog> {
    let foodName = input.customFoodName || "Custom Food Entry";
    let servingUnit = "g";
    let calculated: { calories: number; protein: number; carbs: number; fat: number; fiber: number };

    if (input.foodId) {
      const food = await Food.findById(input.foodId);
      if (!food) {
        throw AppError.notFound("Food item not found in database.");
      }
      foodName = food.name;
      servingUnit = food.servingUnit;

      const scaled = scaleNutrition(
        {
          servingSize: food.servingSize,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
        },
        input.quantity
      );
      calculated = scaled;
    } else if (input.manualNutrients) {
      const scaled = scaleNutrition(
        {
          servingSize: input.manualNutrients.servingSize,
          calories: input.manualNutrients.calories,
          protein: input.manualNutrients.protein,
          carbs: input.manualNutrients.carbs,
          fat: input.manualNutrients.fat,
          fiber: input.manualNutrients.fiber,
        },
        input.quantity
      );
      servingUnit = input.manualNutrients.servingUnit;
      calculated = scaled;
    } else {
      throw AppError.badRequest("Either foodId or manualNutrients must be provided.");
    }

    const log = await FoodLog.create({
      userId,
      foodId: input.foodId || null,
      foodNameSnapshot: foodName,
      date: input.date,
      mealType: input.mealType,
      quantity: input.quantity,
      servingUnit,
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat,
      fiber: calculated.fiber,
      notes: input.notes || "",
    });

    return log;
  }

  static async updateFoodLog(userId: string, logId: string, input: UpdateFoodLogInput): Promise<IFoodLog> {
    const log = await FoodLog.findOne({ _id: logId, userId });
    if (!log) {
      throw AppError.notFound("Food log entry not found.");
    }

    if (input.quantity && input.quantity !== log.quantity) {
      // If foodId exists, recalculate from master food
      if (log.foodId) {
        const food = await Food.findById(log.foodId);
        if (food) {
          const scaled = scaleNutrition(
            {
              servingSize: food.servingSize,
              calories: food.calories,
              protein: food.protein,
              carbs: food.carbs,
              fat: food.fat,
              fiber: food.fiber,
            },
            input.quantity
          );
          log.calories = scaled.calories;
          log.protein = scaled.protein;
          log.carbs = scaled.carbs;
          log.fat = scaled.fat;
          log.fiber = scaled.fiber;
        } else {
          // If master food was deleted, scale proportionally from current log
          const factor = input.quantity / log.quantity;
          log.calories = Math.round(log.calories * factor);
          log.protein = roundTo1Decimal(log.protein * factor);
          log.carbs = roundTo1Decimal(log.carbs * factor);
          log.fat = roundTo1Decimal(log.fat * factor);
          log.fiber = roundTo1Decimal(log.fiber * factor);
        }
      } else {
        const factor = input.quantity / log.quantity;
        log.calories = Math.round(log.calories * factor);
        log.protein = roundTo1Decimal(log.protein * factor);
        log.carbs = roundTo1Decimal(log.carbs * factor);
        log.fat = roundTo1Decimal(log.fat * factor);
        log.fiber = roundTo1Decimal(log.fiber * factor);
      }
      log.quantity = input.quantity;
    }

    if (input.mealType) {
      log.mealType = input.mealType;
    }
    if (input.notes !== undefined) {
      log.notes = input.notes;
    }

    await log.save();
    return log;
  }

  static async deleteFoodLog(userId: string, logId: string): Promise<void> {
    const result = await FoodLog.findOneAndDelete({ _id: logId, userId });
    if (!result) {
      throw AppError.notFound("Food log entry not found or unauthorized.");
    }
  }
}
