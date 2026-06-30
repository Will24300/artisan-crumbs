import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();
const secret = process.env.JWT_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d";
if (!secret) {
    throw new Error("JWT_SECRET is required in environment variables");
}
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const totalUsers = await User.countDocuments();
        const role = totalUsers === 0 ? "admin" : "customer";
        const user = await User.createUser(name, email, password, role);
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: tokenExpiration,
        });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: tokenExpiration,
        });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
});
export default router;
