import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000").transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/nutritrack"),
  JWT_SECRET: z.string().min(16).default("supersecretjwtkey_nutritrack_2026_dev_mode_token"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  COOKIE_SECURE: z.string().default("false").transform((val) => val === "true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
