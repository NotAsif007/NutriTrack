import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { profileRouter } from "./profile.routes.js";
import { foodRouter } from "./food.routes.js";
import { diaryRouter } from "./diary.routes.js";
import { nutritionRouter } from "./nutrition.routes.js";
import { weightRouter } from "./weight.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NutriTrack API is fully operational.",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/foods", foodRouter);
apiRouter.use("/food-logs", diaryRouter);
apiRouter.use("/nutrition", nutritionRouter);
apiRouter.use("/weight-logs", weightRouter);
