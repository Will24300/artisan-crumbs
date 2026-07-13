import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is required in environment variables");
}
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
    if (!token) {
        return res.status(401).json({ error: "Authorization required" });
    }
    try {
        const payload = jwt.verify(token, secret);
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin role required" });
    }
    next();
};
