import { Router } from "express";
import { DiaryController } from "../controllers/diary.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createFoodLogSchema, updateFoodLogSchema, getDiaryQuerySchema } from "../schemas/diary.schema.js";

export const diaryRouter = Router();

diaryRouter.use(requireAuth);
diaryRouter.get("/", validate({ query: getDiaryQuerySchema }), DiaryController.getDiary);
diaryRouter.post("/", validate({ body: createFoodLogSchema }), DiaryController.addFoodLog);
diaryRouter.patch("/:id", validate({ body: updateFoodLogSchema }), DiaryController.updateFoodLog);
diaryRouter.delete("/:id", DiaryController.deleteFoodLog);
