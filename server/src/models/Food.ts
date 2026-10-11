import mongoose, { Document, Schema } from "mongoose";

export const FOOD_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Dairy",
  "Meat & Poultry",
  "Fish & Seafood",
  "Eggs",
  "Legumes",
  "Nuts & Seeds",
  "Snacks",
  "Beverages",
  "Mixed Meals",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export interface IFood extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  searchableName: string;
  category: FoodCategory;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isCustom: boolean;
  creatorId?: mongoose.Types.ObjectId | null;
  dataSource: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    searchableName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: FOOD_CATEGORIES,
      index: true,
    },
    servingSize: {
      type: Number,
      required: true,
      min: 0.1,
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
    isCustom: {
      type: Boolean,
      default: false,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    dataSource: {
      type: String,
      default: "NutriTrack Standard Library",
    },
  },
  {
    timestamps: true,
  }
);

FoodSchema.index({ searchableName: "text" });
FoodSchema.index({ creatorId: 1, isCustom: 1 });

export const Food = mongoose.model<IFood>("Food", FoodSchema);
