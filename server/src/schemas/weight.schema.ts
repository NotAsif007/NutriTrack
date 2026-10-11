import { z } from "zod";

export const createWeightLogSchema = z.object({
  weightKg: z.number().min(20, "Weight must be at least 20 kg").max(400, "Weight must be under 400 kg"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
  notes: z.string().max(300).optional(),
});

export const getWeightLogsQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 60)),
});

export type CreateWeightLogInput = z.infer<typeof createWeightLogSchema>;
