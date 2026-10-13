import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { setupSwagger } from "./config/swagger.js";

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI assets and local scripts
  })
);

// Cross-Origin Resource Sharing
const configuredClientOrigin = env.CLIENT_ORIGIN.replace(/\/$/, "");
const allowedClientOrigins = new Set([
  configuredClientOrigin,
  configuredClientOrigin.startsWith("http") ? configuredClientOrigin : `https://${configuredClientOrigin}`,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      // In development, allow localhost on common vite/react ports
      if (
        allowedClientOrigins.has(origin) ||
        origin === "http://localhost:5173" ||
        origin === "http://localhost:3000" ||
        origin === "http://127.0.0.1:5173"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsing & Cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Interactive OpenAPI Documentation
setupSwagger(app);

// Mount API v1 Routes
app.use("/api/v1", apiRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
      details: [],
    },
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);
