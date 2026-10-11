import { Response, NextFunction } from "express";
import { WeightService } from "../services/weight.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class WeightController {
  static async getWeightLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 60;
      const logs = await WeightService.getWeightLogs(req.user!._id.toString(), limit);
      res.status(200).json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logWeight(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await WeightService.logWeight(req.user!._id.toString(), req.body);
      res.status(201).json({
        success: true,
        message: "Weight recorded successfully.",
        data: { log },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWeightLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await WeightService.deleteWeightLog(req.user!._id.toString(), req.params.id);
      res.status(200).json({
        success: true,
        message: "Weight record deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
