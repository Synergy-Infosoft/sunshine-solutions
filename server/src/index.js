import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/error.middleware.js";
import pool from "./config/db.js";

// Load Env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware (backend-security-coder)
app.use(helmet());

const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
if (!process.env.CORS_ORIGIN && process.env.NODE_ENV === "production") {
  console.warn("⚠️ WARNING: CORS_ORIGIN is not set in production!");
}

app.use(
  cors({
    origin,
    credentials: true,
  }),
);

// Rate Limiting (Prevent Brute Force)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

if (process.env.NODE_ENV === "production") {
  app.use("/api", globalLimiter);
  app.use("/api/applications", submitLimiter);
  app.use("/api/enquiries", submitLimiter);
}

// Body Parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Verify Database Connection on startup
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

// --- ROUTES ---
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/enquiries", enquiryRoutes);

/**
 * --- PRODUCTION FRONTEND SERVING ---
 * We handle React routing here because Hostinger's Shared Hosting 
 * environment often blocks sub-routes (like /admin/login) from reaching index.html.
 * 
 * IF YOU MOVE TO A VPS (NGINX/APACHE):
 * You can delete this entire block and use an .htaccess rule or Nginx 'try_files' instead.
 */
const currentEnv = (process.env.NODE_ENV || "").toLowerCase().trim();
if (currentEnv === "production") {
  try {
    const frontendPath = path.join(__dirname, "../../public_html");
    app.use(express.static(frontendPath));
    
    // Catch-all: Send all non-API requests to index.html for React Router
    app.get(/^(?!\/api).+/, (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) {
          res.status(404).send(`❌ Frontend build not found. Path checked: ${frontendPath}`);
        }
      });
    });
  } catch (error) {
    console.error("❌ Failed to setup frontend serving:", error.message);
  }
}

// Global Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${currentEnv || "development"} mode on port ${PORT}`);
});
