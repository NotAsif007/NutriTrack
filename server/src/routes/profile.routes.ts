import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";

export const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.get("/", ProfileController.getProfile);
profileRouter.patch("/", validate({ body: updateProfileSchema }), ProfileController.updateProfile);
profileRouter.delete("/", ProfileController.deleteAccount);
