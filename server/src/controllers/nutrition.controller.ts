import { Response, NextFunction } from "express";
import { NutritionService } from "../services/nutrition.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class NutritionController {
  static async getDailySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
      const summary = await NutritionService.getDailySummary(req.user!._id.toString(), date);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWeeklySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const endDate = (req.query.endDate as string) || new Date().toISOString().slice(0, 10);
      const summary = await NutritionService.getWeeklySummary(req.user!._id.toString(), endDate);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const endDate = (req.query.endDate as string) || new Date().toISOString().slice(0, 10);
      const summary = await NutritionService.getMonthlySummary(req.user!._id.toString(), endDate);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
