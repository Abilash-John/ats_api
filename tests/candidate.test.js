const request = require("supertest");
const app = require("../src/app");
const { CandidateService } = require("../src/services/CandidateService");
const { protect, authorize } = require("../src/middlewares/authMiddleware");

// Mocking dependencies
jest.mock("../src/services/CandidateService");
jest.mock("../src/middlewares/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { id: "u-1", email: "auth-test@test.com", role: "Recruiter" };
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

describe("Candidate Controller E2E", () => {

    describe("POST /api/v1/candidates", () => {
        it("should register a new candidate", async () => {
             const candidateData = {
                firstName: "John",
                lastName: "Doe",
                email: "john@doe.com",
                skills: ["Node.js", "MySQL"]
            };

            CandidateService.registerCandidate.mockResolvedValue({ id: "c-123", ...candidateData });

            const res = await request(app)
                .post("/api/v1/candidates")
                .send(candidateData);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe("c-123");
        });
    });

    describe("GET /api/v1/candidates/:id", () => {
        it("should retrieve a candidate profile", async () => {
            CandidateService.getCandidateById.mockResolvedValue({ 
                id: "c-123", 
                firstName: "John", 
                email: "john@doe.com" 
            });

            const res = await request(app)
                .get("/api/v1/candidates/c-123")
                .set("Authorization", "Bearer mocked-token");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.firstName).toBe("John");
        });

        it("should return 404 if candidate is not found", async () => {
            CandidateService.getCandidateById.mockRejectedValue(new Error("Candidate not found."));

            const res = await request(app)
                .get("/api/v1/candidates/nonexistent-uuid")
                .set("Authorization", "Bearer mocked-token");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/candidates (Listing from Cache)", () => {
        it("should list all candidates", async () => {
            CandidateService.getAllCandidates.mockResolvedValue([
                { id: "c1", firstName: "A" },
                { id: "c2", firstName: "B" }
            ]);

            const res = await request(app).get("/api/v1/candidates");
            // Wait, candidates listing was public in my routes earlier?
            // Let's check.
            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });
});
