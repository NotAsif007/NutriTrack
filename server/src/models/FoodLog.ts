import mongoose, { Document, Schema } from "mongoose";

export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export interface IFoodLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  foodId?: mongoose.Types.ObjectId | null;
  foodNameSnapshot: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  quantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodLogSchema = new Schema<IFoodLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodId: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      default: null,
    },
    foodNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: MEAL_TYPES,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },
    servingUnit: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

FoodLogSchema.index({ userId: 1, date: 1, mealType: 1 });

export const FoodLog = mongoose.model<IFoodLog>("FoodLog", FoodLogSchema);
