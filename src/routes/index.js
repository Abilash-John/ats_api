const express = require("express");
const { CandidateController } = require("../controllers/CandidateController");
const { JobController } = require("../controllers/JobController");
const { ApplicationController } = require("../controllers/ApplicationController");
const { AuthController } = require("../controllers/AuthController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// --- Auth Routes ---
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// --- Job Routes ---
router.get("/jobs/search", JobController.search);
router.get("/jobs/:id", JobController.getById);
router.post("/jobs", protect, authorize("Recruiter", "Admin"), JobController.postJob);
router.put("/jobs/:id", protect, authorize("Recruiter", "Admin"), JobController.updateJob);

// --- Candidate Routes ---
router.post("/candidates", CandidateController.register);
router.get("/candidates/:id", protect, CandidateController.getById);

// --- Application Routes ---
router.post("/applications", protect, ApplicationController.apply);
router.patch("/applications/:id/stage", protect, authorize("Recruiter", "Admin"), ApplicationController.updateStatus);
router.get("/applications", protect, ApplicationController.getAll);

module.exports = router;
