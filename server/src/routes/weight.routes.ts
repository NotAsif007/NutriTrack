import { Router } from "express";
import { WeightController } from "../controllers/weight.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createWeightLogSchema } from "../schemas/weight.schema.js";

export const weightRouter = Router();

weightRouter.use(requireAuth);
weightRouter.get("/", WeightController.getWeightLogs);
weightRouter.post("/", validate({ body: createWeightLogSchema }), WeightController.logWeight);
weightRouter.delete("/:id", WeightController.deleteWeightLog);
