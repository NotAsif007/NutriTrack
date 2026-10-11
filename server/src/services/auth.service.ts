import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import { User, IUser } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/environment.js";
import { RegisterInput, LoginInput } from "../schemas/auth.schema.js";
import { calculateNutritionTargets } from "../utils/nutritionCalculator.js";

const COOKIE_NAME = "token";

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production" ? true : env.COOKIE_SECURE,
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: "/",
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: 0,
  });
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export class AuthService {
  static async register(input: RegisterInput): Promise<{ user: Partial<IUser>; token: string }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw AppError.conflict("An account with this email address already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    // Initial default targets
    const defaultTargets = calculateNutritionTargets({
      age: 25,
      gender: "prefer_not_to_say",
      heightCm: 170,
      currentWeightKg: 70,
      activityLevel: "sedentary",
      goal: "maintain",
    });

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      profile: {
        age: 25,
        gender: "prefer_not_to_say",
        heightCm: 170,
        currentWeightKg: 70,
        activityLevel: "sedentary",
        goal: "maintain",
      },
      nutritionTarget: {
        targetCalories: defaultTargets.targetCalories,
        targetProteinGrams: defaultTargets.targetProteinGrams,
        targetCarbsGrams: defaultTargets.targetCarbsGrams,
        targetFatGrams: defaultTargets.targetFatGrams,
        calculationMode: "automated",
      },
    });

    const token = generateToken(user._id.toString());
    const userJson = user.toObject();
    delete (userJson as any).passwordHash;

    return { user: userJson, token };
  }

  static async login(input: LoginInput): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw AppError.unauthorized("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized("Invalid email or password.");
    }

    const token = generateToken(user._id.toString());
    const userJson = user.toObject();
    delete (userJson as any).passwordHash;

    return { user: userJson, token };
  }
}
