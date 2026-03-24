const { AuthService } = require("../services/AuthService");

class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            res.status(201).json({ success: true, user });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }
}

module.exports = { AuthController };
