import { app } from "./app.js";
import { env } from "./config/environment.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { seedFoods } from "./scripts/seedFoods.js";
import { Food } from "./models/Food.js";

async function startServer(): Promise<void> {
  try {
    await connectDB();

    // Auto-seed standard foods if database is empty
    const foodCount = await Food.countDocuments({ isCustom: false });
    if (foodCount === 0) {
      console.log("ℹ️ No standard foods found in database. Running auto-seeder...");
      await seedFoods();
    }

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 NutriTrack Server running on http://localhost:${env.PORT}`);
      console.log(`📚 Swagger Docs available at http://localhost:${env.PORT}/api/docs`);
      console.log(`🩺 Health check at http://localhost:${env.PORT}/api/v1/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log("👋 Database disconnected. Process exiting cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
