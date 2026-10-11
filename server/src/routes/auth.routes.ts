import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication attempts. Please try again after 15 minutes.",
      details: [],
    },
  },
});

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate({ body: registerSchema }), AuthController.register);
authRouter.post("/login", authLimiter, validate({ body: loginSchema }), AuthController.login);
authRouter.post("/logout", requireAuth, AuthController.logout);
authRouter.get("/me", requireAuth, AuthController.me);
