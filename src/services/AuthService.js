const { AppDataSource } = require("../config/data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
    static get userRepository() {
        return AppDataSource.getRepository("User");
    }

    static async register(userData) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        return { id: user.id, email: user.email, role: user.role };
    }

    static async login(email, password) {
        const user = await this.userRepository.findOne({ 
            where: { email },
            select: ["id", "email", "password", "role"] 
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials.");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "your_jwt_secret_here",
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        return { token, user: { id: user.id, email: user.email, role: user.role } };
    }
}

module.exports = { AuthService };
