const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_here");

            const userRepository = AppDataSource.getRepository("User");
            const user = await userRepository.findOne({ where: { id: decoded.id } });

            if (!user) {
                return res.status(401).json({ success: false, message: "Not authorized, user not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("JWT Error:", error);
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user?.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
