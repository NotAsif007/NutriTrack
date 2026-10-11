import { Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { clearAuthCookie } from "../services/auth.service.js";

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await ProfileService.getProfile(req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await ProfileService.updateProfile(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProfileService.deleteAccount(req.user!._id.toString());
      clearAuthCookie(res);
      res.status(200).json({
        success: true,
        message: "Account and associated data deleted permanently.",
      });
    } catch (error) {
      next(error);
    }
  }
}
