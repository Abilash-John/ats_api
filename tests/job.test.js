const request = require("supertest");
const app = require("../src/app");
const { JobService } = require("../src/services/JobService");

// Mocking dependencies
jest.mock("../src/services/JobService");
jest.mock("../src/middlewares/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { id: "recruiter-1", role: "Recruiter" };
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

describe("Job Controller E2E", () => {

    describe("POST /api/v1/jobs", () => {
        it("should post a job successfully", async () => {
            const jobData = { title: "Node.js Developer", location: "Remote" };
            JobService.postJob.mockResolvedValue({ id: "j-1", ...jobData });

            const res = await request(app)
                .post("/api/v1/jobs")
                .send(jobData)
                .set("Authorization", "Bearer mocked-recruiter-token");

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("Node.js Developer");
        });

        it("should return error if posting fails", async () => {
             JobService.postJob.mockRejectedValue(new Error("Database write error"));

             const res = await request(app)
                .post("/api/v1/jobs")
                .send({ title: "Bad Job" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Database write error");
        });
    });

    describe("GET /api/v1/jobs/search", () => {
        it("should return weighted search results from Elasticsearch", async () => {
            JobService.searchJobs.mockResolvedValue([
                { title: "Node.js Expert", location: "US" },
                { title: "Backend Engineer", location: "Remote" }
            ]);

            const res = await request(app).get("/api/v1/jobs/search?q=Node");

            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.data[0].title).toBe("Node.js Expert");
        });
    });

    describe("GET /api/v1/jobs/:id (Cached)", () => {
        it("should return job details", async () => {
            JobService.getJobById.mockResolvedValue({ 
                id: "j-1", 
                title: "Cached Job" 
            });

            const res = await request(app).get("/api/v1/jobs/j-1");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe("Cached Job");
        });
    });
});
