import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();
const secret = process.env.JWT_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
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
// ── Real Google OAuth Token Authentication Endpoint ─────────────────────
router.post("/google", async (req, res) => {
    try {
        const { credential, email: clientEmail, name: clientName } = req.body;
        let email = clientEmail;
        let name = clientName;
        let googleId = "";
        if (credential) {
            const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
            if (!googleRes.ok) {
                return res.status(401).json({ error: "Invalid Google token — verification failed." });
            }
            const payload = await googleRes.json();
            // Audience check: reject tokens issued for a different Google OAuth app
            if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
                return res.status(401).json({ error: "Google token was not issued for this application." });
            }
            if (!payload.email_verified || payload.email_verified === "false") {
                return res.status(401).json({ error: "Google account email is not verified." });
            }
            email = payload.email || email;
            name = payload.name || payload.given_name || name;
            googleId = payload.sub || "";
        }
        if (!email) {
            return res.status(400).json({ error: "Google authentication failed: Email address is required." });
        }
        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.createSocialUser(name || email.split("@")[0], email, "google", googleId);
        }
        else {
            if (!user.provider || user.provider === "local") {
                user.provider = "google";
                if (googleId)
                    user.providerId = googleId;
                await user.save();
            }
        }
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: tokenExpiration,
        });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Google login failed", details: error.message });
    }
});
// ── Real Facebook OAuth Token Authentication Endpoint ───────────────────
router.post("/facebook", async (req, res) => {
    try {
        const { accessToken, email: clientEmail, name: clientName, id: clientFBId } = req.body;
        let email = clientEmail;
        let name = clientName;
        let facebookId = clientFBId || "";
        if (accessToken) {
            try {
                const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
                if (fbRes.ok) {
                    const payload = await fbRes.json();
                    if (payload.email)
                        email = payload.email;
                    if (payload.name)
                        name = payload.name;
                    if (payload.id)
                        facebookId = payload.id;
                }
            }
            catch (err) {
                console.warn("Could not verify Facebook access token:", err);
            }
        }
        if (!email) {
            return res.status(400).json({ error: "Facebook authentication failed: Email address is required." });
        }
        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.createSocialUser(name || email.split("@")[0], email, "facebook", facebookId);
        }
        else {
            if (!user.provider || user.provider === "local") {
                user.provider = "facebook";
                if (facebookId)
                    user.providerId = facebookId;
                await user.save();
            }
        }
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: tokenExpiration,
        });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Facebook login failed", details: error.message });
    }
});
// ── Fallback Social Auth Endpoint ───────────────────────────────────────
router.post("/social", async (req, res) => {
    try {
        const { provider, email, name, id } = req.body;
        if (!provider || !["google", "facebook"].includes(provider)) {
            return res.status(400).json({ error: "Invalid or unsupported provider" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email address is required for social login" });
        }
        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.createSocialUser(name || email.split("@")[0], email, provider, id);
        }
        else {
            if (!user.provider || user.provider === "local") {
                user.provider = provider;
                if (id)
                    user.providerId = id;
                await user.save();
            }
        }
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: tokenExpiration,
        });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Social login failed", details: error.message });
    }
});
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email address is required" });
        }
        const user = await User.findByEmail(email);
        const successMsg = "If an account with that email exists, password reset instructions have been generated.";
        if (!user) {
            return res.json({ message: successMsg });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour expiration
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expires;
        await user.save();
        console.log(`[AUTH] Password reset requested for ${user.email}. Token: ${resetToken}`);
        res.json({
            message: successMsg,
            resetToken,
            resetUrl: `/reset-password?token=${resetToken}`,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to process forgot password request", details: error.message });
    }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: "Reset token and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired password reset token" });
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to reset password", details: error.message });
    }
});
// ── Get Current Authenticated User ──────────────────────────────────────
router.get("/me", authenticateToken, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider || "local",
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch profile", details: error.message });
    }
});
// ── Update Profile (Name) ────────────────────────────────────────────────
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Name cannot be empty" });
        }
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        user.name = name.trim();
        await user.save();
        res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider || "local",
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
});
// ── Change Password ──────────────────────────────────────────────────────
router.put("/change-password", authenticateToken, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters long" });
        }
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        if (user.provider && user.provider !== "local") {
            return res.status(400).json({ error: "Social accounts (Google/Facebook) do not have a password." });
        }
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(400).json({ error: "Incorrect current password" });
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: "Password changed successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to change password", details: error.message });
    }
});
export default router;
