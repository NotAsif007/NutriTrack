import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./environment.js";

let mongod: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  // If already connected, do nothing
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Attempt real MongoDB connection first
  try {
    const mongoUri = env.MONGODB_URI;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ Connected to MongoDB at ${mongoUri}`);
  } catch (err: any) {
    console.warn(`⚠️ Could not connect to local MongoDB (${err.message}). Starting in-memory MongoDB instance...`);
    try {
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ Connected to in-memory MongoDB at ${inMemoryUri}`);
    } catch (memErr: any) {
      console.error("❌ Failed to start in-memory MongoDB:", memErr);
      throw memErr;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}
