const request = require("supertest");
const app = require("../src/app");
const { ApplicationService } = require("../src/services/ApplicationService");

// Mocking dependencies
jest.mock("../src/services/ApplicationService");
jest.mock("../src/middlewares/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { id: "candidate-1", role: "Candidate" };
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

describe("Application Controller E2E", () => {
    
    describe("POST /api/v1/applications", () => {
        it("should submit application and return success", async () => {
            const applicationData = { candidateId: "c-1", jobId: "j-1", notes: "Excited!" };
            ApplicationService.applyToJob.mockResolvedValue({ id: "a-123", ...applicationData, status: "Applied" });

            const res = await request(app)
                .post("/api/v1/applications")
                .send(applicationData)
                .set("Authorization", "Bearer mocked-token");

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe("Applied");
        });

        it("should return error on duplicate application (Redlock/Service Error)", async () => {
            ApplicationService.applyToJob.mockRejectedValue(new Error("Candidate already applied to this job."));

            const res = await request(app)
                .post("/api/v1/applications")
                .send({ jobId: "already-applied-job" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Candidate already applied to this job.");
        });
    });

    describe("PATCH /api/v1/applications/:id/stage", () => {
        it("should move application stage and return success", async () => {
            ApplicationService.updateStatus.mockResolvedValue({ id: "app-id", status: "Interview" });

            const res = await request(app)
                .patch("/api/v1/applications/app-id/stage")
                .send({ status: "Interview" })
                .set("Authorization", "Bearer recruiter-token");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe("Interview");
        });
    });

    describe("GET /api/v1/applications", () => {
        it("should list/filter applications for a recruiter", async () => {
            ApplicationService.listApplications.mockResolvedValue([
                { id: "app-1", jobId: "job-A" },
                { id: "app-2", jobId: "job-A" }
            ]);

            const res = await request(app)
                .get("/api/v1/applications?job_id=job-A")
                .set("Authorization", "Bearer recruiter-token");

            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });
});
