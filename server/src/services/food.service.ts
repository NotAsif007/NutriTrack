import mongoose from "express";
import { Food, IFood } from "../models/Food.js";
import { AppError } from "../utils/AppError.js";
import { CreateCustomFoodInput, SearchFoodQuery } from "../schemas/food.schema.js";

export class FoodService {
  static async searchFoods(userId: string, query: SearchFoodQuery): Promise<IFood[]> {
    const { q, category, limit = 30 } = query;

    const filter: any = {
      $or: [{ isCustom: false }, { isCustom: true, creatorId: userId }],
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (q && q.trim().length > 0) {
      const cleanQ = q.trim();
      filter.$and = [
        {
          $or: [
            { searchableName: { $regex: cleanQ.toLowerCase(), $options: "i" } },
            { name: { $regex: cleanQ, $options: "i" } },
          ],
        },
      ];
    }

    return Food.find(filter)
      .sort({ isCustom: -1, name: 1 })
      .limit(limit)
      .lean() as unknown as Promise<IFood[]>;
  }

  static async getFoodById(id: string, userId: string): Promise<IFood> {
    const food = await Food.findById(id);
    if (!food) {
      throw AppError.notFound("Food item not found.");
    }

    if (food.isCustom && food.creatorId && food.creatorId.toString() !== userId) {
      throw AppError.forbidden("You do not have permission to view this custom food.");
    }

    return food;
  }

  static async createCustomFood(userId: string, input: CreateCustomFoodInput): Promise<IFood> {
    const food = await Food.create({
      name: input.name,
      searchableName: input.name.toLowerCase().trim(),
      category: input.category,
      servingSize: input.servingSize,
      servingUnit: input.servingUnit,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
      fiber: input.fiber || 0,
      isCustom: true,
      creatorId: userId,
      dataSource: "User Created Food",
    });

    return food;
  }

  static async deleteCustomFood(userId: string, foodId: string): Promise<void> {
    const food = await Food.findById(foodId);
    if (!food) {
      throw AppError.notFound("Food item not found.");
    }

    if (!food.isCustom || !food.creatorId || food.creatorId.toString() !== userId) {
      throw AppError.forbidden("You can only delete custom food items created by your account.");
    }

    await Food.findByIdAndDelete(foodId);
  }
}
