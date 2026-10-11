import { User, IUser } from "../models/User.js";
import { FoodLog } from "../models/FoodLog.js";
import { Food } from "../models/Food.js";
import { WeightLog } from "../models/WeightLog.js";
import { AppError } from "../utils/AppError.js";
import { UpdateProfileInput } from "../schemas/profile.schema.js";
import { calculateNutritionTargets } from "../utils/nutritionCalculator.js";

export class ProfileService {
  static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      throw AppError.notFound("User not found.");
    }
    return user;
  }

  static async updateProfile(userId: string, input: UpdateProfileInput): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found.");
    }

    if (input.name) user.name = input.name;
    if (input.age !== undefined && input.age !== null) user.profile.age = input.age;
    if (input.gender !== undefined) user.profile.gender = input.gender;
    if (input.heightCm !== undefined && input.heightCm !== null) user.profile.heightCm = input.heightCm;
    if (input.currentWeightKg !== undefined && input.currentWeightKg !== null)
      user.profile.currentWeightKg = input.currentWeightKg;
    if (input.activityLevel !== undefined) user.profile.activityLevel = input.activityLevel;
    if (input.goal !== undefined) user.profile.goal = input.goal;
    if (input.dietaryPreference !== undefined) user.profile.dietaryPreference = input.dietaryPreference;

    // Handle Calorie Target Calculation / Override
    if (input.calculationMode === "manual" && input.customTargetCalories) {
      user.nutritionTarget.targetCalories = input.customTargetCalories;
      user.nutritionTarget.calculationMode = "manual";
      // Standard macro distribution for manual target
      user.nutritionTarget.targetProteinGrams = Math.round((input.customTargetCalories * 0.25) / 4);
      user.nutritionTarget.targetCarbsGrams = Math.round((input.customTargetCalories * 0.5) / 4);
      user.nutritionTarget.targetFatGrams = Math.round((input.customTargetCalories * 0.25) / 9);
    } else if (input.calculationMode === "automated" || user.nutritionTarget.calculationMode === "automated") {
      const calculated = calculateNutritionTargets({
        age: user.profile.age,
        gender: user.profile.gender,
        heightCm: user.profile.heightCm,
        currentWeightKg: user.profile.currentWeightKg,
        activityLevel: user.profile.activityLevel,
        goal: user.profile.goal,
      });

      user.nutritionTarget.targetCalories = calculated.targetCalories;
      user.nutritionTarget.targetProteinGrams = calculated.targetProteinGrams;
      user.nutritionTarget.targetCarbsGrams = calculated.targetCarbsGrams;
      user.nutritionTarget.targetFatGrams = calculated.targetFatGrams;
      user.nutritionTarget.calculationMode = "automated";
    }

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj as IUser;
  }

  static async deleteAccount(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found.");
    }

    // Cascade delete private records
    await FoodLog.deleteMany({ userId });
    await WeightLog.deleteMany({ userId });
    await Food.deleteMany({ creatorId: userId, isCustom: true });
    await User.findByIdAndDelete(userId);
  }
}
