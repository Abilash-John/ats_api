require("express-async-errors");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { errorHandler } = require("./middlewares/errorMiddleware");
const apiRoutes = require("./routes");

const expressRateLimit = require("express-rate-limit");

const app = express();

const authLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many auth attempts. Please try again later." }
});

const searchLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, error: "Too many search requests. Please throttle your access." }
});

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Specialized Rate Limiters
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1/jobs/search", searchLimiter);

// Landing / API Info
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the ATS API (Node.js)",
        version: "1.0.0",
        stack: ["Node.js", "TypeORM", "MySQL", "Redis", "Elasticsearch", "BullMQ"],
        endpoints: {
            health: "/health",
            api: "/api"
        }
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "ATS API (Node.js) is running smooth!" });
});

// Mount API Routes
app.use("/api/v1", apiRoutes);

// Error Handler (Always at the end)
app.use(errorHandler);

module.exports = app;
