import { WeightLog, IWeightLog } from "../models/WeightLog.js";
import { AppError } from "../utils/AppError.js";
import { CreateWeightLogInput } from "../schemas/weight.schema.js";

export class WeightService {
  static async getWeightLogs(userId: string, limit = 60): Promise<IWeightLog[]> {
    return WeightLog.find({ userId }).sort({ date: 1 }).limit(limit).lean() as unknown as Promise<IWeightLog[]>;
  }

  static async logWeight(userId: string, input: CreateWeightLogInput): Promise<IWeightLog> {
    // Upsert for the day
    const existing = await WeightLog.findOne({ userId, date: input.date });
    if (existing) {
      existing.weightKg = input.weightKg;
      if (input.notes !== undefined) existing.notes = input.notes;
      await existing.save();
      return existing;
    }

    const log = await WeightLog.create({
      userId,
      weightKg: input.weightKg,
      date: input.date,
      notes: input.notes || "",
    });

    return log;
  }

  static async deleteWeightLog(userId: string, logId: string): Promise<void> {
    const deleted = await WeightLog.findOneAndDelete({ _id: logId, userId });
    if (!deleted) {
      throw AppError.notFound("Weight log not found.");
    }
  }
}
