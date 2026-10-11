import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile {
  age?: number;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  heightCm?: number;
  currentWeightKg?: number;
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
  goal: "maintain" | "lose" | "gain";
  dietaryPreference?: string;
}

export interface INutritionTarget {
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  calculationMode: "automated" | "manual";
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  profile: IUserProfile;
  nutritionTarget: INutritionTarget;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profile: {
      age: { type: Number, min: 10, max: 120 },
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
        default: "prefer_not_to_say",
      },
      heightCm: { type: Number, min: 50, max: 250 },
      currentWeightKg: { type: Number, min: 20, max: 400 },
      activityLevel: {
        type: String,
        enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"],
        default: "sedentary",
      },
      goal: {
        type: String,
        enum: ["maintain", "lose", "gain"],
        default: "maintain",
      },
      dietaryPreference: { type: String, default: "none" },
    },
    nutritionTarget: {
      targetCalories: { type: Number, default: 2000 },
      targetProteinGrams: { type: Number, default: 125 },
      targetCarbsGrams: { type: Number, default: 250 },
      targetFatGrams: { type: Number, default: 55 },
      calculationMode: {
        type: String,
        enum: ["automated", "manual"],
        default: "automated",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
