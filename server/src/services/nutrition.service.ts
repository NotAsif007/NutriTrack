import { FoodLog } from "../models/FoodLog.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { DiaryService } from "./diary.service.js";
import { roundTo1Decimal } from "../utils/nutritionCalculator.js";

export class NutritionService {
  static async getDailySummary(userId: string, date: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found.");
    }

    const diary = await DiaryService.getDiaryByDate(userId, date);
    const targetCalories = user.nutritionTarget.targetCalories || 2000;
    const consumedCalories = diary.totalCalories;

    const remainingCalories = Math.max(0, targetCalories - consumedCalories);
    const isOverTarget = consumedCalories > targetCalories;
    const overTargetCalories = isOverTarget ? consumedCalories - targetCalories : 0;
    const percentage = targetCalories > 0 ? Math.round((consumedCalories / targetCalories) * 100) : 0;

    return {
      date,
      targetCalories,
      consumedCalories,
      remainingCalories,
      isOverTarget,
      overTargetCalories,
      percentage,
      macros: {
        protein: {
          consumed: diary.totalProtein,
          target: user.nutritionTarget.targetProteinGrams || 125,
        },
        carbs: {
          consumed: diary.totalCarbs,
          target: user.nutritionTarget.targetCarbsGrams || 250,
        },
        fat: {
          consumed: diary.totalFat,
          target: user.nutritionTarget.targetFatGrams || 55,
        },
        fiber: {
          consumed: diary.totalFiber,
          target: 30, // Recommended standard
        },
      },
      meals: {
        Breakfast: {
          calories: diary.meals.Breakfast.calories,
          protein: diary.meals.Breakfast.protein,
          carbs: diary.meals.Breakfast.carbs,
          fat: diary.meals.Breakfast.fat,
          itemCount: diary.meals.Breakfast.items.length,
        },
        Lunch: {
          calories: diary.meals.Lunch.calories,
          protein: diary.meals.Lunch.protein,
          carbs: diary.meals.Lunch.carbs,
          fat: diary.meals.Lunch.fat,
          itemCount: diary.meals.Lunch.items.length,
        },
        Dinner: {
          calories: diary.meals.Dinner.calories,
          protein: diary.meals.Dinner.protein,
          carbs: diary.meals.Dinner.carbs,
          fat: diary.meals.Dinner.fat,
          itemCount: diary.meals.Dinner.items.length,
        },
        Snacks: {
          calories: diary.meals.Snacks.calories,
          protein: diary.meals.Snacks.protein,
          carbs: diary.meals.Snacks.carbs,
          fat: diary.meals.Snacks.fat,
          itemCount: diary.meals.Snacks.items.length,
        },
      },
    };
  }

  static async getWeeklySummary(userId: string, endDateStr: string) {
    const user = await User.findById(userId);
    if (!user) throw AppError.notFound("User not found.");

    const targetCalories = user.nutritionTarget.targetCalories || 2000;
    const endDate = new Date(endDateStr);

    // Generate past 7 dates
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const logs = await FoodLog.find({
      userId,
      date: { $in: dates },
    });

    const dayMap = new Map<
      string,
      { calories: number; protein: number; carbs: number; fat: number; hasLogs: boolean }
    >();

    for (const d of dates) {
      dayMap.set(d, { calories: 0, protein: 0, carbs: 0, fat: 0, hasLogs: false });
    }

    for (const log of logs) {
      const entry = dayMap.get(log.date);
      if (entry) {
        entry.calories += log.calories;
        entry.protein = roundTo1Decimal(entry.protein + log.protein);
        entry.carbs = roundTo1Decimal(entry.carbs + log.carbs);
        entry.fat = roundTo1Decimal(entry.fat + log.fat);
        entry.hasLogs = true;
      }
    }

    const days = dates.map((date) => {
      const data = dayMap.get(date)!;
      return {
        date,
        calories: data.calories,
        targetCalories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        hasLogs: data.hasLogs,
      };
    });

    const loggedDays = days.filter((d) => d.hasLogs);
    const totalConsumed = loggedDays.reduce((acc, d) => acc + d.calories, 0);
    const averageCalories = loggedDays.length > 0 ? Math.round(totalConsumed / loggedDays.length) : 0;

    return {
      days,
      targetCalories,
      averageCalories,
      loggedDaysCount: loggedDays.length,
      totalTrackedDays: 7,
    };
  }

  static async getMonthlySummary(userId: string, endDateStr: string) {
    const user = await User.findById(userId);
    if (!user) throw AppError.notFound("User not found.");

    const targetCalories = user.nutritionTarget.targetCalories || 2000;
    const endDate = new Date(endDateStr);

    const dates: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const logs = await FoodLog.find({
      userId,
      date: { $in: dates },
    });

    const dayMap = new Map<string, { calories: number; hasLogs: boolean }>();
    for (const d of dates) {
      dayMap.set(d, { calories: 0, hasLogs: false });
    }

    for (const log of logs) {
      const entry = dayMap.get(log.date);
      if (entry) {
        entry.calories += log.calories;
        entry.hasLogs = true;
      }
    }

    const days = dates.map((date) => {
      const data = dayMap.get(date)!;
      return {
        date,
        calories: data.calories,
        targetCalories,
        hasLogs: data.hasLogs,
      };
    });

    const loggedDays = days.filter((d) => d.hasLogs);
    const loggedCalorieList = loggedDays.map((d) => d.calories);

    const totalConsumed = loggedCalorieList.reduce((acc, c) => acc + c, 0);
    const averageCalories = loggedDays.length > 0 ? Math.round(totalConsumed / loggedDays.length) : 0;
    const highestCalories = loggedCalorieList.length > 0 ? Math.max(...loggedCalorieList) : 0;
    const lowestCalories = loggedCalorieList.length > 0 ? Math.min(...loggedCalorieList) : 0;

    return {
      days,
      targetCalories,
      averageCalories,
      highestCalories,
      lowestCalories,
      loggedDaysCount: loggedDays.length,
      totalTrackedDays: 30,
    };
  }
}
