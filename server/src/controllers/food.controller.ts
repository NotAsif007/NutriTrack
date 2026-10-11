import { Response, NextFunction } from "express";
import { FoodService } from "../services/food.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class FoodController {
  static async searchFoods(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const foods = await FoodService.searchFoods(req.user!._id.toString(), req.query as any);
      res.status(200).json({
        success: true,
        data: { foods },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFoodById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const food = await FoodService.getFoodById(req.params.id, req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: { food },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCustomFood(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const food = await FoodService.createCustomFood(req.user!._id.toString(), req.body);
      res.status(201).json({
        success: true,
        message: "Custom food item added successfully.",
        data: { food },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomFood(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await FoodService.deleteCustomFood(req.user!._id.toString(), req.params.id);
      res.status(200).json({
        success: true,
        message: "Custom food deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
