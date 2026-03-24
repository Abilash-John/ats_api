const request = require("supertest");
const app = require("../src/app");
const { AuthService } = require("../src/services/AuthService");

// Mocking the AuthService to avoid MySQL requirement during tests
jest.mock("../src/services/AuthService");

describe("Auth Controller E2E", () => {
    
    describe("POST /api/v1/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                userName: "testuser",
                email: "test@example.com",
                password: "password123",
                role: "Recruiter"
            };

            AuthService.register.mockResolvedValue({ id: "uuid-123", ...userData });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user.userName).toBe("testuser");
        });

        it("should return 400 on service error", async () => {
             AuthService.register.mockRejectedValue(new Error("Email already exists"));

             const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ email: "r1@test.com" });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Email already exists");
        });
    });

    describe("POST /api/v1/auth/login", () => {
        it("should login successfully and return JWT", async () => {
            AuthService.login.mockResolvedValue({
                token: "mocked-jwt-token",
                user: { id: "u-1", email: "test@test.com" }
            });

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "test@test.com", password: "123" });

            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBe("mocked-jwt-token");
        });
    });
});
