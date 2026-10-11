import { Response, NextFunction } from "express";
import { DiaryService } from "../services/diary.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class DiaryController {
  static async getDiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
      const diary = await DiaryService.getDiaryByDate(req.user!._id.toString(), date);
      res.status(200).json({
        success: true,
        data: diary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addFoodLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await DiaryService.addFoodLog(req.user!._id.toString(), req.body);
      res.status(201).json({
        success: true,
        message: "Food logged successfully.",
        data: { log },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateFoodLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await DiaryService.updateFoodLog(req.user!._id.toString(), req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Food log updated successfully.",
        data: { log: updated },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFoodLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await DiaryService.deleteFoodLog(req.user!._id.toString(), req.params.id);
      res.status(200).json({
        success: true,
        message: "Food entry removed from diary.",
      });
    } catch (error) {
      next(error);
    }
  }
}
