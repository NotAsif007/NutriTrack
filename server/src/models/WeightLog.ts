import mongoose, { Document, Schema } from "mongoose";

export interface IWeightLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  weightKg: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: Date;
}

const WeightLogSchema = new Schema<IWeightLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weightKg: {
      type: Number,
      required: true,
      min: 20,
      max: 400,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// One weight entry per user per calendar day
WeightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const WeightLog = mongoose.model<IWeightLog>("WeightLog", WeightLogSchema);
